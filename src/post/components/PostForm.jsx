import CategoryCard from './CategoryCard';
import RegionCard from './RegionCard';

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
                    className={`alert alert-${alert.type} text-center shadow post-form-alert`}
                    role="alert"
                >
                    {alert.message}
                </div>
            )}
            <div className={`post-viewport ${isEdit ? "py-5" : ""}`}>
                <div className="container my-5 post-form-container">
                    <div className="card shadow-lg border-0 rounded-4 p-4 post-form-card">
                        <h2 className="mb-3 fw-bold text-center post-form-title">
                            {isEdit ? '글 수정' : '글 작성'}
                        </h2>
                        <div className="text-secondary text-center mb-4 post-subtitle">
                            여행지, 사진, 지역, 카테고리, 후기를 모두 입력해 주세요!
                        </div>
                        {isEdit && (
                            <div className="mb-4 d-flex justify-content-end">
                                <span className="fw-semibold post-form-author-label">작성자:</span>
                                <span className="fw-bold post-form-author-value">
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
                                        <RegionCard selectedRegion={post.region} setRegion={onRegionChange} />
                                    </div>
                                </div>
                            </div>
                            {imageSection}
                            <div className="mb-4">
                                <label htmlFor="content" className="form-label fw-semibold">후기 / 내용</label>
                                <textarea
                                    className="form-control post-form-textarea" id="content" rows="7"
                                    required maxLength={2000}
                                    placeholder="여행지에 대한 후기를 자유롭게 작성해 주세요 :)"
                                    value={post.content} onChange={onChange}
                                />
                            </div>
                            <div className={`d-flex pt-2 ${isEdit ? 'justify-content-between' : 'justify-content-end'}`}>
                                {isEdit && (
                                    <button
                                        className="btn btn-danger px-5 py-2 fs-5 fw-bold rounded-pill shadow post-form-action-btn"
                                        type="button"
                                        onClick={onDelete}
                                    >
                                        삭제
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-primary px-5 py-2 fs-5 fw-bold rounded-pill shadow post-form-action-btn"
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
