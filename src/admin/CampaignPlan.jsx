import React, { useState } from 'react';

const CampaignPlan = () => {
  const [campaignType, setCampaignType] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-02');
  const [customerType, setCustomerType] = useState('개인');
  const [visibility, setVisibility] = useState('비공개');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* 왼쪽: 사이드 메뉴 */}

        {/* 오른쪽: 본문 */}
        <div className="col-md-9 col-lg-10 p-4">
          <h4 className="mb-4 fw-bold">캠페인 기획</h4>
          <div className="card p-4">
            <h5 className="fw-bold mb-3">캠페인 기초 정보</h5>
            <div className="mb-3">
              <label className="form-label">캠페인 분류</label>
              <select className="form-select" value={campaignType} onChange={e => setCampaignType(e.target.value)}>
                <option value="">선택</option>
                <option value="조기정착">조기정착</option>
                <option value="이탈방지">이탈방지</option>
                <option value="재구매">재구매</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">캠페인 명</label>
              <input type="text" className="form-control" value={campaignName} onChange={e => setCampaignName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">캠페인 설명</label>
              <textarea className="form-control" rows="3" value={campaignDescription} onChange={e => setCampaignDescription(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">수행 일자</label>
              <div className="d-flex gap-2">
                <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
              <small className="text-muted">일부까지 실적으로 인정</small>
            </div>
            <div className="mb-3">
              <label className="form-label">고객군 유형</label>
              <select className="form-select" value={customerType} onChange={e => setCustomerType(e.target.value)}>
                <option>개인</option>
                <option>기업</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">공개 설정</label>
              <div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="visibility" value="비공개" checked={visibility === '비공개'} onChange={e => setVisibility(e.target.value)} />
                  <label className="form-check-label">비공개</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="visibility" value="모두공개" checked={visibility === '모두공개'} onChange={e => setVisibility(e.target.value)} />
                  <label className="form-check-label">모두공개</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="visibility" value="부서공개" checked={visibility === '부서공개'} onChange={e => setVisibility(e.target.value)} />
                  <label className="form-check-label">부서공개</label>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">태그</label>
              <input type="text" className="form-control" value={tags} onChange={e => setTags(e.target.value)} placeholder="#태그" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">캠페인 자료 첨부</label>
              <input type="file" className="form-control" onChange={e => setFile(e.target.files[0])} />
            </div>
            <a className="btn btn-primary" href="/admin">저장하기</a>
          </div>
          <p className="float-end mb-1">
            <a type="button" href="/admin">관리자 페이지</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignPlan;
