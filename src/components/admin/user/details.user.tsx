import { FORMATE_DATE } from "@/services/helper";
import { Descriptions, Drawer, Badge } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetails: boolean;
    setOpenViewDetails: (v: boolean) => void;
    dataViewDetails: IUserTable | null;
    setDataViewDetails: (v: IUserTable | null) => void;
}

const DetailsUser = (props: IProps) => {
    const { openViewDetails, setOpenViewDetails, dataViewDetails, setDataViewDetails } = props;

    const onClose = () => {
        setOpenViewDetails(false);
        setDataViewDetails(null);
    }

    return (
        <>
            <Drawer
                title="User details"
                width={"50vw"}
                open={openViewDetails}
                onClose={onClose}
            >
                <Descriptions
                    title="User info"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetails?.id}</Descriptions.Item>
                    <Descriptions.Item label="Fullname">{dataViewDetails?.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetails?.email}</Descriptions.Item>
                    <Descriptions.Item label="Date of birth">
                        {dayjs(dataViewDetails?.dateOfBirth).format(FORMATE_DATE)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetails?.role.name}/>
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default DetailsUser;