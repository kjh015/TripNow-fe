import { useState, useEffect, useRef } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import RegionRadioComp from "./RegionRadioComp";
import CategoryCard from "./CategoryCard";
import BoardApiClient from "../../service/BoardApiClient";

const BoardSearch = ({selectedCategory, selectedRegion}) => {
    const [board, setBoard] = useState({
        category: "",
        region: ""
    });
    const [keyword, setKeyword] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showList, setShowList] = useState(false);
    const [highlightIdx, setHighlightIdx] = useState(-1); // highlight index
    const inputRef = useRef();
    const listRef = useRef();
    const navigate = useNavigate();
    const abortRef = useRef();

    // 자동완성 fetch
    useEffect(() => {
        setBoard({category: selectedCategory, region: selectedRegion});
        if (!keyword) {
            setSuggestions([]);
            setShowList(false);
            return;
        }
        const timer = setTimeout(() => {
            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;
            BoardApiClient.autoCompleteSearch({ keyword, signal: controller.signal })
                .then(res => res.json())
                .then(data => {
                    setSuggestions(data);
                    setShowList(true);
                    setHighlightIdx(-1);
                })
                .catch(e => {
                    if (e.name !== "AbortError") {
                        setSuggestions([]);
                        setShowList(false);
                    }
                });
        }, 200);

        return () => clearTimeout(timer);
    }, [keyword]);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        if (!showList) return;
        function onClickOutside(e) {
            if (
                inputRef.current && !inputRef.current.contains(e.target) &&
                listRef.current && !listRef.current.contains(e.target)
            ) {
                setShowList(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, [showList]);

    const handleCategoryChange = (category) => {
        setBoard(prev => ({ ...prev, category }));
    };

    const handleRegionChange = (region) => {
        setBoard(prev => ({ ...prev, region }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (board.category) params.append("category", board.category);
        if (board.region) params.append("region", board.region);
        if (keyword) params.append("keyword", keyword);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "travel_search_click",
            category: board.category ? board.category : "없음",
            region: board.region ? board.region : "없음"
        });
        navigate(`/board/list?${params.toString()}`);
    };

    // 자동완성 선택
    const handleSuggestionClick = (text) => {
        setKeyword(text);
        setShowList(false);
        inputRef.current.blur();
    };

    // input 이탈시 자동완성 닫힘 (조금 늦게 닫음)
    const handleBlur = () => setTimeout(() => setShowList(false), 120);

    // 키보드 네비게이션
    const handleKeyDown = (e) => {
        if (!showList) return;
        if (e.key === "ArrowDown") {
            setHighlightIdx(prev =>
                prev < suggestions.length - 1 ? prev + 1 : 0
            );
            e.preventDefault();
        } else if (e.key === "ArrowUp") {
            setHighlightIdx(prev =>
                prev > 0 ? prev - 1 : suggestions.length - 1
            );
            e.preventDefault();
        } else if (e.key === "Enter") {
            if (highlightIdx >= 0 && highlightIdx < suggestions.length) {
                handleSuggestionClick(suggestions[highlightIdx]);
            }
        } else if (e.key === "Escape") {
            setShowList(false);
        }
    };

    // 입력 키워드 강조 표시
    const highlightText = (text) => {
        if (!keyword) return text;
        const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <mark style={{ background: "#ffe066", padding: 0 }}>{text.slice(idx, idx + keyword.length)}</mark>
                {text.slice(idx + keyword.length)}
            </>
        );
    };

    return (
        <div>
            <Card className="shadow-sm rounded-4 mx-auto" style={{ maxWidth: 700, padding: '32px 36px', background: '#fff' }}>
                <Row className="g-3">
                    <Col md={6}>
                        <div className="bg-light rounded-4 p-2 px-3 border">
                            <CategoryCard selectedCategory={board.category} setCategory={handleCategoryChange} />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="bg-light rounded-4 p-2 px-3 border">
                            <RegionRadioComp selectedRegion={board.region} setRegion={handleRegionChange} />
                        </div>
                    </Col>
                </Row>
                <Form className="mb-4" onSubmit={handleSubmit}>
                    <div className="text-center mb-3"></div>
                    <div className="d-flex" style={{ gap: 8, position: "relative" }}>
                        <Form.Control
                            ref={inputRef}
                            type="search"
                            placeholder="검색어를 입력하세요"
                            value={keyword}
                            aria-label="검색"
                            autoComplete="off"
                            onChange={e => setKeyword(e.target.value)}
                            onFocus={() => setShowList(true)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            style={{ height: "40px", flexGrow: 1, zIndex: 11 }}
                        />
                        {/* 자동완성 드롭다운 */}
                        {showList && (
                            <ul
                                ref={listRef}
                                style={{
                                    position: "absolute",
                                    top: 44, left: 0, right: 0,
                                    zIndex: 10,
                                    margin: 0, padding: 0,
                                    background: "white",
                                    border: "1px solid #eee",
                                    borderRadius: "0 0 12px 12px",
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                                    listStyle: "none",
                                    maxHeight: 260,
                                    overflowY: "auto",
                                    minWidth: 200,
                                    transition: "box-shadow 0.2s"
                                }}
                            >
                                {suggestions.length === 0 && (
                                    <li
                                        style={{
                                            padding: "12px 16px",
                                            color: "#bbb",
                                            fontStyle: "italic"
                                        }}
                                    >
                                        검색 결과가 없습니다
                                    </li>
                                )}
                                {suggestions.map((item, idx) => (
                                    <li
                                        key={idx}
                                        onMouseDown={() => handleSuggestionClick(item)}
                                        style={{
                                            padding: "12px 16px",
                                            cursor: "pointer",
                                            background: idx === highlightIdx ? "#f8f9fa" : "transparent",
                                            fontWeight: idx === highlightIdx ? "bold" : "normal",
                                            color: "#333",
                                            borderBottom: idx < suggestions.length - 1 ? "1px solid #f5f5f5" : "none",
                                            fontSize: 17,
                                            transition: "background 0.1s"
                                        }}
                                        onMouseEnter={() => setHighlightIdx(idx)}
                                    >
                                        {highlightText(item)}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Button
                            variant="dark btn-sm"
                            type="submit"
                            style={{
                                whiteSpace: 'nowrap',
                                padding: '0.2rem 0.35rem',
                                height: "40px"
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="mx-3" role="img" viewBox="0 0 24 24"><title>Search</title><circle cx="10.5" cy="10.5" r="7.5"></circle><path d="M21 21l-5.2-5.2"></path></svg>
                        </Button>
                    </div>
                </Form>
                
            </Card>
        </div>
    );
};

export default BoardSearch;
