import './BalancePage.scss';
import Navbar from "../homePage/components/Navbar/Navbar.tsx";
import WalletList from "../homePage/components/walletList/walletList.tsx";
import BalanceHistory from "../homePage/components/BalanceHistory/BalanceHistory.tsx";

function BalancePage() {
    return (
        <div className="transactions-page">
            <Navbar/>
            <div className="transactions-page__content">
                <WalletList/>
                <div className="transactions-page__content__visualisations">
                    <BalanceHistory/>
                </div>
            </div>
        </div>
    );
}

export default BalancePage;