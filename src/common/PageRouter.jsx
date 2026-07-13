import { BrowserRouter, Routes, Route } from "react-router-dom";

// sign
import SignUpPage from '../sign/components/SignUpPage';
import SignUpdatePage from "../sign/components/SignUpdatePage";
import SignInPage from "../sign/components/SignInPage";
import OAuth2RedirectPage from "../sign/components/OAuth2RedirectPage";
import SocialProfilePage from "../sign/components/SocialProfilePage";
import PasswordChangePage from "../sign/components/PasswordChangePage";
import MyPage from '../sign/components/MyPage';

// main
import MainPage from "../main/pages/MainPage";

// admin
import AdminPage from "../admin/AdminPage";
import CampaignPlan from "../admin/CampaignPlan";

// post
import PostDetailPage from "../post/pages/PostDetailPage";
import PostListPage from "../post/pages/PostListPage";
import PostWritePage from "../post/pages/PostWritePage";
import PostEditPage from "../post/pages/PostEditPage";
import FavoriteListPage from "../post/pages/FavoriteListPage";
import MyPostsPage from "../post/pages/MyPostsPage";

// comment
import MyCommentsPage from "../comment/pages/MyCommentsPage";

// log
import FormatManagement from "../log/components/format/FormatManagement";
import ProcessManagement from "../log/components/process/ProcessManagement";
import FilterManagement from "../log/components/filter/FilterManagement";
import LogManagement from "../log/components/db/LogManagement";
import DeduplicationManagement from "../log/components/deduplication/DeduplicationManagement";

// layout & guards
import RootLayout from "../components/layout/RootLayout";
import PrivateRoute from "../components/PrivateRoute";
import NotFoundPage from "../components/NotFoundPage";

const PageRouter = () => {
    return (
        <BrowserRouter>
            <RootLayout>
                <Routes>
                    {/* 공개 */}
                    <Route path="/" element={<MainPage />} />
                    <Route path="/post/list" element={<PostListPage />} />
                    <Route path="/post/detail" element={<PostDetailPage />} />
                    <Route path="/sign/in" element={<SignInPage />} />
                    <Route path="/sign/up" element={<SignUpPage />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
                    <Route path="/campaign-plan" element={<CampaignPlan />} />

                    {/* 로그인 필요 */}
                    <Route path="/post/write" element={<PrivateRoute><PostWritePage /></PrivateRoute>} />
                    <Route path="/post/edit" element={<PrivateRoute><PostEditPage /></PrivateRoute>} />
                    <Route path="/post/favorite-list" element={<PrivateRoute><FavoriteListPage /></PrivateRoute>} />
                    <Route path="/post/my-article" element={<PrivateRoute><MyPostsPage /></PrivateRoute>} />
                    <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
                    <Route path="/sign/social-profile" element={<PrivateRoute><SocialProfilePage /></PrivateRoute>} />
                    <Route path="/sign/update" element={<PrivateRoute><SignUpdatePage /></PrivateRoute>} />
                    <Route path="/sign/update/password" element={<PrivateRoute><PasswordChangePage /></PrivateRoute>} />
                    <Route path="/comment/my-comments" element={<PrivateRoute><MyCommentsPage /></PrivateRoute>} />

                    {/* 어드민 필요 */}
                    <Route path="/admin" element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />
                    <Route path="/log/format" element={<PrivateRoute adminOnly><FormatManagement /></PrivateRoute>} />
                    <Route path="/log/process" element={<PrivateRoute adminOnly><ProcessManagement /></PrivateRoute>} />
                    <Route path="/log/filter" element={<PrivateRoute adminOnly><FilterManagement /></PrivateRoute>} />
                    <Route path="/log/db" element={<PrivateRoute adminOnly><LogManagement /></PrivateRoute>} />
                    <Route path="/log/deduplication" element={<PrivateRoute adminOnly><DeduplicationManagement /></PrivateRoute>} />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </RootLayout>
        </BrowserRouter>
    );
};

export default PageRouter;
