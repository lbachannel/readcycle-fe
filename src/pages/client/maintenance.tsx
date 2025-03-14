import 'styles/maintenance.scss';
import maintenanceImg from 'assets/img/maintenance.png';

const MaintenancePage = () => {
    return (
        <>
            <div className="maintenance">
                <img className="maintenance__img" src={maintenanceImg} alt="Maintenance" />
                <p className="maintenance__desc">Maintenance mode, we will be back soon</p>
            </div>
        </>
    )
}

export default MaintenancePage;