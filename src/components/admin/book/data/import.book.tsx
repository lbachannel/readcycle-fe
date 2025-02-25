import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload, UploadProps } from "antd";

const { Dragger } = Upload;

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
}

const ImportUser = (props: IProps) => {
    const { setOpenModalImport, openModalImport } = props;
    const { message } = App.useApp();

    const propsUpload: UploadProps = {
        name: "file",
        multiple: false,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess("ok");
                }
            }, 1000);
        },

        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
              console.log(info.file, info.fileList);
            }
            if (status === 'done') {
              message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
        },

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    }

    return (
        <>
            <Modal 
                title="Import data book"
                width={"80vw"}
                open={openModalImport}
                onOk={() => setOpenModalImport(false)}
                onCancel={() => setOpenModalImport(false)}
                okText="Import data"
                okButtonProps={{
                    disabled: true
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
                        title={() => <span>Data upload:</span>}
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

export default ImportUser;