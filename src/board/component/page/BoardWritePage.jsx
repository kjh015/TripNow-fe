import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';
import RegionRadioComp from './RegionRadioComp';
import BoardApiClient from '../../service/BoardApiClient';
import { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';

const BoardWritePage = () => {
    const navigate = useNavigate();
    const [board, setBoard] = useState({
        title: '',
        content: '',
        memberNickname: '',
        travelPlace: '',
        address: '',
        category: '',
        region: ''
    });

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    // Bootstrap Alert 상태 (처음에 show: false)
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Alert 메시지 자동 닫힘 (0.5초)
    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 500);
            return () => clearTimeout(timer);
        }
    }, [alert.show]);

    // 로그인 체크 및 닉네임 셋팅
    useEffect(() => {
        let nickname = localStorage.getItem("nickname");
        if (!nickname) {
            setAlert({ show: true, message: "로그인이 필요합니다.", type: "danger" });
            setTimeout(() => navigate(-1), 500); // 0.5초 후 뒤로가기
            return;
        }
        setBoard(prev => ({
            ...prev,
            memberNickname: nickname
        }));
    }, [navigate]);

    // 입력 값 변경
    const handleChange = (e) => {
        const { id, value } = e.target;
        setBoard(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // 카테고리 카드 선택
    const handleCategorySelect = (cat) => {
        setBoard(prev => ({
            ...prev,
            category: cat
        }));
    };

    // 지역 라디오 변경
    const handleRegionChange = (regionValue) => {
        setBoard(prev => ({
            ...prev,
            region: regionValue
        }));
    };

    // 이미지 업로드
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.filter(f => !images.some(img => img.name === f.name));
        setImages(prev => [...prev, ...newFiles]);
        setImagePreviews(prev => [
            ...prev,
            ...newFiles.map(file => URL.createObjectURL(file))
        ]);
    };

    // 이미지 제거
    const handleImageRemove = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    // 글 작성 제출
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!images || images.length === 0) {
            setAlert({ show: true, message: "사진을 한 장 이상 첨부해 주세요!", type: "danger" });
            return;
        }

        const formData = new FormData();
        const boardBlob = new Blob([JSON.stringify(board)], { type: "application/json" });
        formData.append('board', boardBlob);
        images.forEach(file => formData.append('images', file));

        try {
            const response = await BoardApiClient.addBoard(formData);
            if (response.ok) {
                setAlert({ show: true, message: "글 작성이 완료되었습니다.", type: "success" });
                setTimeout(() => navigate('/board/list'), 500); // 0.5초 후 이동, 잔상 없음
            } else {
                setAlert({ show: true, message: "글 작성에 실패하였습니다.", type: "danger" });
            }
        } catch (err) {
            setAlert({ show: true, message: "오류가 발생했습니다.", type: "danger" });
            console.error(err);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                overflowX: "hidden",
                position: "relative"
            }}
        >
            {/* Bootstrap Alert 메시지 (화면 상단 고정) */}
            {alert.show && (
                <div className={`alert alert-${alert.type} text-center mb-3`} role="alert"
                    style={{
                        position: "fixed",
                        top: 80,
                        left: "50%",
                        transform: "translateX(-50%)",
                        minWidth: 220,
                        zIndex: 2000
                    }}>
                    {alert.message}
                </div>
            )}

            <div className="container my-5" style={{ maxWidth: '900px' }}>
                <div className="card shadow-lg border-0 rounded-4 p-4" style={{ background: "#ffffffeb" }}>
                    <h2 className="mb-3 text-center fw-bold" style={{ letterSpacing: '2px' }}>글 작성</h2>
                    <div className="text-secondary text-center mb-4" style={{ fontSize: '1.07rem' }}>
                        여행지, 사진, 지역, 카테고리, 후기를 모두 입력해 주세요!
                    </div>
                    <form onSubmit={handleSubmit}>

                        {/* 제목 */}
                        <div className="mb-4">
                            <label htmlFor="title" className="form-label fw-semibold">제목</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="title"
                                required
                                maxLength={40}
                                placeholder="제목을 입력하세요"
                                value={board.title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 여행지 이름 + 주소 */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-5">
                                <label htmlFor="travelPlace" className="form-label fw-semibold">여행지 이름</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="travelPlace"
                                    required
                                    placeholder="예: 남산타워"
                                    value={board.travelPlace}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-7">
                                <label htmlFor="address" className="form-label fw-semibold">여행지 주소</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    required
                                    placeholder="예: 서울특별시 중구 남산공원길 105"
                                    value={board.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* 카테고리/지역 */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-6 ">
                                <label className="form-label fw-semibold">카테고리</label>
                                <div className="bg-light rounded-4 p-2 px-3 border">
                                    <CategoryCard
                                        selectedCategory={board.category}
                                        setCategory={handleCategorySelect}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">지역 선택</label>
                                <div className="bg-light rounded-4 p-2 px-3 border">
                                    <RegionRadioComp
                                        selectedRegion={board.region}
                                        setRegion={handleRegionChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 사진 첨부 */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                사진 첨부 <span className="text-secondary" style={{ fontSize: "0.95em" }}>(필수)</span>
                            </label>
                            <div className="bg-light rounded-4 p-3 px-4 border">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="form-control mb-3"
                                />
                                <div className="d-flex flex-wrap gap-3">
                                    {imagePreviews.map((src, idx) => (
                                        <div key={idx} style={{ position: 'relative' }}>
                                            <img
                                                src={src}
                                                alt={`preview-${idx}`}
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: 'cover',
                                                    borderRadius: 14,
                                                    border: '1px solid #eee',
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                style={{
                                                    position: 'absolute', top: 5, right: 5, borderRadius: '50%', padding: '2px 7px', fontSize: "1.05rem"
                                                }}
                                                onClick={() => handleImageRemove(idx)}
                                            >×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 내용 */}
                        <div className="mb-4">
                            <label htmlFor="content" className="form-label fw-semibold">후기 / 내용</label>
                            <textarea
                                className="form-control"
                                id="content"
                                rows="7"
                                required
                                maxLength={2000}
                                placeholder="여행지에 대한 후기를 자유롭게 작성해 주세요 :)"
                                value={board.content}
                                onChange={handleChange}
                                style={{ minHeight: 140 }}
                            ></textarea>
                        </div>

                        {/* 버튼 */}
                        <div className="d-flex justify-content-end pt-2">
                            <button
                                type="submit"
                                className="btn btn-primary px-5 py-2 fs-5 fw-bold rounded-pill shadow"
                                style={{ minWidth: 140, letterSpacing: '1px' }}
                                disabled={images.length === 0}
                            >
                                글쓰기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BoardWritePage;
