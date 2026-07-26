
const CategoryCard = ({ selectedCategory, setCategory }) => {
    const categories = ["축제", "공연", "행사", "체험", "쇼핑", "자연", "역사", "가족", "음식"];
    return (
        <div className="selector-panel">
            <div className="fw-bold mb-3 d-flex align-items-center selector-heading">
                <i className="bi bi-tag-fill me-2 selector-icon-gradient" />
                카테고리 선택
            </div>
            <div className="row row-cols-3 g-3">
                {categories.map(category => (
                    <div className="col" key={category}>
                        <div
                            className={`text-center category-card-btn shadow-sm
                                ${selectedCategory === category ? "category-card-active" : ""}`}
                            onClick={() => setCategory(selectedCategory === category ? "" : category)}
                            tabIndex={0}
                            onKeyPress={e => {
                                if (e.key === "Enter" || e.key === " ") setCategory(category);
                            }}
                            role="button"
                        >
                            {category}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryCard;
