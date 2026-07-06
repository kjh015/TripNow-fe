import { useState, useEffect, useRef } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import RegionRadioComp from "../../board/component/page/RegionRadioComp";
import CategoryCard from "../../board/component/page/CategoryCard";
import { autoCompleteSearch } from "../../api/postSearchApi";

const PostSearch = ({ selectedCategory, selectedRegion }) => {
    const [post, setPost] = useState({ category: "", region: "" });
    const [keyword, setKeyword] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showList, setShowList] = useState(false);
    const [highlightIdx, setHighlightIdx] = useState(-1);
    const inputRef = useRef();
    const listRef = useRef();
    const navigate = useNavigate();
    const abortRef = useRef();

    useEffect(() => {
        setPost({ category: selectedCategory, region: selectedRegion });
        if (!keyword) {
            setSuggestions([]);
            setShowList(false);
            return;
        }
        const timer = setTimeout(async () => {
            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;
            try {
                const { data } = await autoCompleteSearch(keyword, controller.signal);
                setSuggestions(data.result?.titles || []);
                setShowList(true);
                setHighlightIdx(-1);
            } catch (e) {
                if (e.code !== 'ERR_CANCELED') {
                    setSuggestions([]);
                    setShowList(false);
                }
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [keyword]);

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
        setPost(prev => ({ ...prev, category }));
    };

    const handleRegionChange = (region) => {
        setPost(prev => ({ ...prev, region }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (post.category) params.append("category", post.category);
        if (post.region) params.append("region", post.region);
        if (keyword) params.append("keyword", keyword);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "travel_search_click",
            category: post.category ? post.category : "없음",
            region: post.region ? post.region : "없음"
        });
        navigate(`/post/list?${params.toString()}`);
    };

    const handleSuggestionClick = (text) => {
        setKeyword(text);
        setShowList(false);
        inputRef.current.blur();
    };

    const handleBlur = () => setTimeout(() => setShowList(false), 120);

    const handleKeyDown = (e) => {
        if (!showList) return;
        if (e.key === "ArrowDown") {
            setHighlightIdx(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
            e.preventDefault();
        } else if (e.key === "ArrowUp") {
            setHighlightIdx(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
            e.preventDefault();
        } else if (e.key === "Enter") {
            if (highlightIdx >= 0 && highlightIdx < suggestions.length) {
                handleSuggestionClick(suggestions[highlightIdx]);
            }
        } else if (e.key === "Escape") {
            setShowList(false);
        }
    };

    const highlightText = (text) => {
        if (!keyword) return text;
        const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <mark className="post-search-highlight">{text.slice(idx, idx + keyword.length)}</mark>
                {text.slice(idx + keyword.length)}
            </>
        );
    };

    return (
        <div>
            <Card className="shadow-sm rounded-4 mx-auto post-search-card">
                <Row className="g-3">
                    <Col md={6}>
                        <div className="bg-light rounded-4 p-2 px-3 border">
                            <CategoryCard selectedCategory={post.category} setCategory={handleCategoryChange} />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="bg-light rounded-4 p-2 px-3 border">
                            <RegionRadioComp selectedRegion={post.region} setRegion={handleRegionChange} />
                        </div>
                    </Col>
                </Row>
                <Form className="mb-4" onSubmit={handleSubmit}>
                    <div className="text-center mb-3"></div>
                    <div className="d-flex gap-2 position-relative">
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
                            className="post-search-input"
                        />
                        {showList && (
                            <ul ref={listRef} className="post-search-suggestions">
                                {suggestions.length === 0 && (
                                    <li className="post-search-suggestion-empty">
                                        검색 결과가 없습니다
                                    </li>
                                )}
                                {suggestions.map((item, idx) => (
                                    <li
                                        key={idx}
                                        onMouseDown={() => handleSuggestionClick(item)}
                                        className={`post-search-suggestion${idx === highlightIdx ? " active" : ""}`}
                                        onMouseEnter={() => setHighlightIdx(idx)}
                                    >
                                        {highlightText(item)}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Button variant="dark btn-sm" type="submit" className="post-search-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="mx-3" role="img" viewBox="0 0 24 24"><title>Search</title><circle cx="10.5" cy="10.5" r="7.5"></circle><path d="M21 21l-5.2-5.2"></path></svg>
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default PostSearch;
