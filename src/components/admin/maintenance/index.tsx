import { getMaintenanceStatus } from "@/services/api";
import { App, Switch } from "antd";
import { useEffect, useState } from "react";

const Maintenance = () => {
    const [switchState, setSwitchState] = useState<boolean>(false);
    // const [maintenance, setMaintenance] = useState<IMaintenance | null>(null);
    const { message } = App.useApp();

    // maintenance
    useEffect(() => {
        const fetMaintenanceStatus = async () => {
            try {
                const response = await getMaintenanceStatus();
                setSwitchState(response.data?.inMaintenance!);
            } catch (error) {
                message.success("Failed to fetch maintenance status");
            }
        };

        fetMaintenanceStatus();
    }, []);

    return (
        <>
            <p>
                Maintenance
            </p>
            <Switch
                checked={switchState} />
        </>
    )
}

export default Maintenance;