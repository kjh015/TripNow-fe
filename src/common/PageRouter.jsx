import { BrowserRouter, Routes, Route } from "react-router-dom";

// sign
import SignUpPage from '../sign/component/SignUpPage';
import SignUpdatePage from "../sign/component/SignUpdatePage";
import SignInPage from "../sign/component/SignInPage";
import PasswordChangePage from "../sign/component/PasswordChangePage";

// board/main
import MainPage from "../board/component/page/MainPage";
import AdmnPage from "./AdmnPage";
import MyPage from '../common/MyPage';
import CampaignPlan from "../board/component/page/CampaignPlan";
import LikeListPage from "./LikeListPage";
import CheckMyArt from "./CheckMyArt";

// post
import PostDetailPage from "../post/pages/PostDetailPage";
import PostListPage from "../post/pages/PostListPage";
import PostWritePage from "../post/pages/PostWritePage";
import PostEditPage from "../post/pages/PostEditPage";

// comment
import ChckMyCom from "./ChckMyCom";

// log
import FormatManagement from "../log/components/format/FormatManagement";
import ProcessManagement from "../log/components/process/ProcessManagement";
import FilterManagement from "../log/components/filter/FilterManagement";
import LogManagement from "../log/components/db/LogManagement";
import DeduplicationManagement from "../log/components/deduplication/DeduplicationManagement";

// layout & guards
import RootLayout from "../components/layout/RootLayout";
import PrivateRoute from "../components/PrivateRoute";

const PageRouter = () => {
    return (
        <BrowserRouter>
            <RootLayout>
                <Routes>
                    {/* 공개 */}
                    <Route path="/" element={<MainPage />} />
                    <Route path="/post/list" element={<PostListPage />} />
                    <Route path="/post/detail" element={<PostDetailPage />} />
                    <Route path="/sign/component/SignInPage" element={<SignInPage />} />
                    <Route path="/sign/component/SignUpPage" element={<SignUpPage />} />
                    <Route path="/component/campaignplan" element={<CampaignPlan />} />

                    {/* 로그인 필요 */}
                    <Route path="/post/write" element={<PrivateRoute><PostWritePage /></PrivateRoute>} />
                    <Route path="/post/edit" element={<PrivateRoute><PostEditPage /></PrivateRoute>} />
                    <Route path="/post/favorite-list" element={<PrivateRoute><LikeListPage /></PrivateRoute>} />
                    <Route path="/post/my-article" element={<PrivateRoute><CheckMyArt /></PrivateRoute>} />
                    <Route path="/common/MyPage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
                    <Route path="/sign/update" element={<PrivateRoute><SignUpdatePage /></PrivateRoute>} />
                    <Route path="/sign/update/password" element={<PrivateRoute><PasswordChangePage /></PrivateRoute>} />
                    <Route path="/page/chckmycom" element={<PrivateRoute><ChckMyCom /></PrivateRoute>} />

                    {/* 어드민 필요 */}
                    <Route path="/component/admnpage" element={<PrivateRoute adminOnly><AdmnPage /></PrivateRoute>} />
                    <Route path="/log/format" element={<PrivateRoute adminOnly><FormatManagement /></PrivateRoute>} />
                    <Route path="/log/process" element={<PrivateRoute adminOnly><ProcessManagement /></PrivateRoute>} />
                    <Route path="/log/filter" element={<PrivateRoute adminOnly><FilterManagement /></PrivateRoute>} />
                    <Route path="/log/db" element={<PrivateRoute adminOnly><LogManagement /></PrivateRoute>} />
                    <Route path="/log/deduplication" element={<PrivateRoute adminOnly><DeduplicationManagement /></PrivateRoute>} />
                </Routes>
            </RootLayout>
        </BrowserRouter>
    );
};

export default PageRouter;
