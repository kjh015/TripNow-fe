
const RegionRadioCard = ({ selectedRegion, setRegion }) => {
    const cities = ["강원", "경기", "대구", "부산", "서울", "인천", "전남", "제주", "기타"];
    return (
        <div style={{ minWidth: 240, maxWidth: 350 }}>
            <div className="fw-bold mb-3 d-flex align-items-center" style={{ color: "#1565c0", fontSize: "1.18rem" }}>
                <i
                    className="bi bi-geo-alt-fill me-2"
                    style={{
                        fontSize: "1.3rem",
                        background: "linear-gradient(90deg, #42a5f5 10%, #7e57c2 80%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}
                />
                지역 선택
            </div>
            <div className="row row-cols-3 g-3">
                {cities.map(city => (
                    <div className="col" key={city}>
                        <div
                            className={`text-center region-card-btn shadow-sm
                                ${selectedRegion === city ? "region-card-active" : ""}`}
                            onClick={() => setRegion(selectedRegion === city ? "" : city)}
                            style={{
                                borderRadius: "18px",
                                background: selectedRegion === city
                                    ? "linear-gradient(90deg,#e3f2fd 70%,#ede7f6 100%)"
                                    : "#fff",
                                color: selectedRegion === city ? "#1760c6" : "#7b8da3",
                                fontWeight: selectedRegion === city ? 700 : 500,
                                cursor: "pointer",
                                padding: "14px 0",
                                boxShadow: selectedRegion === city
                                    ? "0 4px 16px 0 rgba(33, 150, 243, 0.12)"
                                    : "0 2px 7px 0 rgba(90,120,180,0.08)",
                                outline: "none",
                                transform: selectedRegion === city ? "scale(1.07)" : "scale(1)",
                                transition: "all 0.16s cubic-bezier(.5,1.7,.76,1.18)"
                            }}
                            tabIndex={0}
                            onKeyPress={e => {
                                if (e.key === "Enter" || e.key === " ") setRegion(city);
                            }}
                            role="button"
                        >
                            {city}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegionRadioCard;
