import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload, UploadProps } from "antd";
import { useState } from "react";
import Exceljs from 'exceljs';
import { Buffer } from 'buffer';
import { bulkCreateBooksAPI } from "@/services/api";

const { Dragger } = Upload;

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
    refreshTable: () => void;
}


interface IDataImport {
    title: string;
    category: string;
    author: string;
    publisher: string;
    description: string;
    quantity: number;
    status: string;
    active: boolean;
}

const ImportBook = (props: IProps) => {
    const { setOpenModalImport, openModalImport, refreshTable } = props;
    const { message, notification } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: "file",
        multiple: false,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest({ onSuccess }) {
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess("ok");
                }
            }, 1000);
        },

        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    // load file to buffer
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    // convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) {
                            return;
                        }
                        let keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                                // obj.id = i;
                            }
                            jsonData.push(obj);
                        })
                    });
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })
                    setDataImport(jsonData)
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    }

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            title: item.title,
            category: item.category,
            author: item.author,
            publisher: item.publisher,
            description: item.description,
            quantity: item.quantity,
            status: item.status,
            active: item.active
        }))
        const response = await bulkCreateBooksAPI(dataSubmit);
        if (response.data) {
            notification.success({
                message: "Bulk Create Users",
                description: `Success = ${response.data.countSuccess}. Error = ${response.data.countError}`
            })
        }
        setIsSubmit(false);
        setOpenModalImport(false);
        setDataImport([]);
        refreshTable();
    }

    return (
        <>
            <Modal 
                title="Import data book"
                width={"90vw"}
                open={openModalImport}
                onOk={() => handleImport()}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataImport([])
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                //do not close when click outside
                maskClosable={false}
                destroyOnClose={true}>
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <span>Data upload:</span>}
                        dataSource={dataImport}
                        columns={[
                            { dataIndex: "title", title: "Title"},
                            { dataIndex: "category", title: "Category"},
                            { dataIndex: "author", title: "Author"},
                            { dataIndex: "publisher", title: "Publisher"},
                            { dataIndex: "quantity", title: "Quantity"},
                            { dataIndex: "status", title: "Status"},
                            { dataIndex: "active", title: "Active"},
                        ]}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ImportBook;