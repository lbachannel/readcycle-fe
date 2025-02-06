
import { Modal, Tabs } from "antd";


interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { isModalOpen, setIsModalOpen } = props;


    return (
        <Modal
            title="Management account"
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            maskClosable={false}
            width={"60vw"}
        >
            <Tabs
                defaultActiveKey="info"
            />
        </Modal>
    )
}

export default ManageAccount;