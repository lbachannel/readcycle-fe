import { getMaintenanceStatus, toggleMaintenance } from "@/services/api";
import { App, Switch } from "antd";
import { useEffect, useState } from "react";

const Maintenance = () => {
    const [switchState, setSwitchState] = useState<boolean>(false);
    const { message } = App.useApp();

    // maintenance
    useEffect(() => {
        const fetMaintenanceStatus = async () => {
            try {
                const response = await getMaintenanceStatus();
                setSwitchState(response.data?.maintenanceMode!);
            } catch (error) {
                message.error("Failed to fetch maintenance status");
            }
        };

        fetMaintenanceStatus();
    }, []);

    const handleToggleMaintenance = async () => {
        try {
            const newState = !switchState;
            const response = await toggleMaintenance(newState);
            if (response && response.data) {
                setSwitchState(newState);
                message.success(`Maintenance is ${newState ? "On" : "Off"}`);
            } else {
                message.error("Failed to update maintenance status");
            }
        } catch (error) {
            message.error("Failed to update maintenance status");
        }
    }   

    return (
        <>
            <p>
                Maintenance
            </p>
            <Switch
                checked={switchState}
                onChange={handleToggleMaintenance} />
        </>
    )
}

export default Maintenance;