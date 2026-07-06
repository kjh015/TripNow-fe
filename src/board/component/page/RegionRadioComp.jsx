
const RegionRadioCard = ({ selectedRegion, setRegion }) => {
    const cities = ["강원", "경기", "대구", "부산", "서울", "인천", "전남", "제주", "기타"];
    return (
        <div className="selector-panel">
            <div className="fw-bold mb-3 d-flex align-items-center selector-heading">
                <i className="bi bi-geo-alt-fill me-2 selector-icon-gradient" />
                지역 선택
            </div>
            <div className="row row-cols-3 g-3">
                {cities.map(city => (
                    <div className="col" key={city}>
                        <div
                            className={`text-center region-card-btn shadow-sm
                                ${selectedRegion === city ? "region-card-active" : ""}`}
                            onClick={() => setRegion(selectedRegion === city ? "" : city)}
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
