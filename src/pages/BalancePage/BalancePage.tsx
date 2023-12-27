import './BalancePage.scss';
import Navbar from "../homePage/components/Navbar/Navbar.tsx";
import WalletList from "../homePage/components/walletList/walletList.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import BalanceHistory from "../homePage/components/BalanceHistory/BalanceHistory.tsx";

function BalancePage() {
    const user = useSelector((state: RootState) => {
        return state.user;
    })
    return (
        <div className="transactions-page">
            <Navbar user={user}/>
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