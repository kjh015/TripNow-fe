import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";


//sign
import SignUpPage from '../sign/component/SignUpPage';
import SignUpdatePage from "../sign/component/SignUpdatePage";
import LogIn from "../notUse/LogIn";
import SignInPage from "../sign/component/SignInPage";
import PasswordChangePage from "../sign/component/PasswordChangePage";

//board
import MainPage from "../board/component/page/MainPage";
import AdmnPage from "./AdmnPage";
import BoardDetailPage from "../board/component/page/BoardDetailPage";
import MyPage from '../common/MyPage';
import CampaignPlan from "../board/component/page/CampaignPlan";
import BoardWritePage from "../board/component/page/BoardWritePage";
import BoardEditPage from "../board/component/page/BoardEditPage";
import LikeListPage from "./LikeListPage";
import CheckMyArt from "./CheckMyArt";
import MyPlace from "../board/component/page/MyPlace";

//comment
import ChckMyCom from "./ChckMyCom";

//others
import BoardList from "../board/component/page/BoardList";
import FormatManagement from "../log/components/format/FormatManagement";
import ProcessManagement from "../log/components/process/ProcessManagement";
import FilterManagement from "../log/components/filter/FilterManagement";
import LogManagement from "../log/components/db/LogManagement";
import Navbar from "./Navbar";
import DeduplicationManagement from "../log/components/deduplication/DeduplicationManagement";
import Footers from "./Footers";
import GlobalNavigator from "./GlobalNavigator";

const PageRouter = () => {
    return (
        <BrowserRouter>
            <GlobalNavigator />

            <Navbar />
            <div style={{ paddingTop: 25 }} />
            <Routes>
                {/* common */}
                <Route index path="/" element={<MainPage />}></Route>
                <Route index path="/component/admnpage" element={<AdmnPage />}></Route>

                {/* board */}
                <Route path="/board/list" element={<BoardList />} />
                <Route path="/board/detail" element={<BoardDetailPage />} />
                <Route path="/board/favorite-list" element={<LikeListPage />} />
                <Route path="/board/component/page/MyPlace" element={<MyPlace />} />
                <Route path="/board/write" element={<BoardWritePage />} />
                <Route path="/board/edit" element={<BoardEditPage />} />

                {/* sign */}
                <Route index path="/component/login" element={<LogIn />}></Route>
                <Route path="/sign/update" element={<SignUpdatePage />} />
                <Route path="/sign/component/SignUpPage" element={<SignUpPage />} />
                <Route path="/sign/component/SignInPage" element={<SignInPage />} />
                <Route path="/sign/update/password" element={<PasswordChangePage />} />

                {/* log */}
                <Route index path="/log/format" element={<FormatManagement />}></Route>
                <Route index path="/log/process" element={<ProcessManagement />}></Route>
                <Route index path="/log/filter" element={<FilterManagement />}></Route>
                <Route index path="/log/db" element={<LogManagement />}></Route>
                <Route index path="/log/deduplication" element={<DeduplicationManagement />}></Route>


                {/* comment */}
                <Route path="page/chckmycom" element={<ChckMyCom />} />


                <Route index path="/component/campaignplan" element={<CampaignPlan />}></Route>


                <Route path="/board/my-article" element={<CheckMyArt />} />
                <Route path="/common/MyPage" element={<MyPage />} />
            </Routes>

        </BrowserRouter>
    );
};


export default PageRouter;    