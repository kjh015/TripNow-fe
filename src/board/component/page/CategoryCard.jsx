
const CategoryCard = ({ selectedCategory, setCategory }) => {
    const categories = ["축제", "공연", "행사", "체험", "쇼핑", "자연", "역사", "가족", "음식"];
    return (
        <div style={{ minWidth: 240, maxWidth: 350 }}>
            <div className="fw-bold mb-3 d-flex align-items-center" style={{ color: "#1565c0", fontSize: "1.18rem" }}>
                <i
                    className="bi bi-tag-fill me-2"
                    style={{
                        fontSize: "1.3rem",
                        background: "linear-gradient(90deg, #42a5f5 10%, #7e57c2 80%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}
                />
                카테고리 선택
            </div>
            <div className="row row-cols-3 g-3">
                {categories.map(category => (
                    <div className="col" key={category}>
                        <div
                            className={`text-center category-card-btn shadow-sm
                                ${selectedCategory === category ? "category-card-active" : ""}`}
                            onClick={() => setCategory(selectedCategory === category ? "" : category)}
                            style={{
                                borderRadius: "18px",
                                background: selectedCategory === category
                                    ? "linear-gradient(90deg,#e3f2fd 70%,#ede7f6 100%)"
                                    : "#f7fafd",
                                color: selectedCategory === category ? "#1760c6" : "#7b8da3",
                                fontWeight: selectedCategory === category ? 700 : 500,
                                cursor: "pointer",
                                padding: "14px 0",
                                boxShadow: selectedCategory === category
                                    ? "0 4px 16px 0 rgba(33, 150, 243, 0.10)"
                                    : "0 2px 7px 0 rgba(90,120,180,0.06)",
                                outline: "none",
                                transform: selectedCategory === category ? "scale(1.07)" : "scale(1)",
                                transition: "all 0.16s cubic-bezier(.5,1.7,.76,1.18)"
                            }}
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
