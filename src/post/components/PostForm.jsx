import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryCard from '../../board/component/page/CategoryCard';
import RegionRadioComp from '../../board/component/page/RegionRadioComp';

const PostForm = ({
    post,
    mode,
    onChange,
    onCategorySelect,
    onRegionChange,
    onSubmit,
    onDelete,
    imageSection,
    alert,
    submitDisabled = false,
}) => {
    const isEdit = mode === 'edit';

    return (
        <>
            {alert.show && (
                <div
                    className={`alert alert-${alert.type} text-center shadow`}
                    role="alert"
                    style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", minWidth: 240, zIndex: 3000 }}
                >
                    {alert.message}
                </div>
            )}
            <div
                className={isEdit ? "py-5" : ""}
                style={{ minHeight: "100vh", width: "100vw", overflowX: "hidden", position: "relative" }}
            >
                <div className="container my-5" style={{ maxWidth: '900px' }}>
                    <div className="card shadow-lg border-0 rounded-4 p-4" style={{ background: "#ffffffeb" }}>
                        <h2 className="mb-3 fw-bold" style={{ textAlign: 'center', letterSpacing: '2px' }}>
                            {isEdit ? '글 수정' : '글 작성'}
                        </h2>
                        <div className="text-secondary text-center mb-4" style={{ fontSize: '1.07rem' }}>
                            여행지, 사진, 지역, 카테고리, 후기를 모두 입력해 주세요!
                        </div>
                        {isEdit && (
                            <div className="mb-4 d-flex justify-content-end">
                                <span className="fw-semibold" style={{ fontSize: '1.08rem', color: '#222', marginRight: 6 }}>작성자:</span>
                                <span className="fw-bold" style={{ fontSize: '1.08rem', minWidth: 80, display: 'inline-block' }}>
                                    {post.memberNickname || ""}
                                </span>
                            </div>
                        )}
                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="form-label fw-semibold">제목</label>
                                <input
                                    type="text" className="form-control form-control-lg" id="title"
                                    required maxLength={40} placeholder="제목을 입력하세요"
                                    value={post.title} onChange={onChange}
                                />
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-md-5">
                                    <label htmlFor="travelPlace" className="form-label fw-semibold">여행지 이름</label>
                                    <input
                                        type="text" className="form-control" id="travelPlace"
                                        required placeholder="예: 남산타워"
                                        value={post.travelPlace} onChange={onChange}
                                    />
                                </div>
                                <div className="col-md-7">
                                    <label htmlFor="address" className="form-label fw-semibold">여행지 주소</label>
                                    <input
                                        type="text" className="form-control" id="address"
                                        required placeholder="예: 서울특별시 중구 남산공원길 105"
                                        value={post.address} onChange={onChange}
                                    />
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">카테고리</label>
                                    <div className="bg-light rounded-4 p-2 px-3 border">
                                        <CategoryCard selectedCategory={post.category || ''} setCategory={onCategorySelect} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">지역 선택</label>
                                    <div className="bg-light rounded-4 p-2 px-3 border">
                                        <RegionRadioComp selectedRegion={post.region} setRegion={onRegionChange} />
                                    </div>
                                </div>
                            </div>
                            {imageSection}
                            <div className="mb-4">
                                <label htmlFor="content" className="form-label fw-semibold">후기 / 내용</label>
                                <textarea
                                    className="form-control" id="content" rows="7"
                                    required maxLength={2000}
                                    placeholder="여행지에 대한 후기를 자유롭게 작성해 주세요 :)"
                                    value={post.content} onChange={onChange}
                                    style={{ minHeight: 140 }}
                                />
                            </div>
                            <div className={`d-flex pt-2 ${isEdit ? 'justify-content-between' : 'justify-content-end'}`}>
                                {isEdit && (
                                    <button
                                        className="btn btn-danger px-5 py-2 fs-5 fw-bold rounded-pill shadow"
                                        type="button"
                                        style={{ minWidth: 140, letterSpacing: '1px' }}
                                        onClick={onDelete}
                                    >
                                        삭제
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-primary px-5 py-2 fs-5 fw-bold rounded-pill shadow"
                                    style={{ minWidth: 140, letterSpacing: '1px' }}
                                    disabled={submitDisabled}
                                >
                                    {isEdit ? '완료' : '글쓰기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostForm;
