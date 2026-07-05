import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const DataFormat2 = () => {
    return (
        <div>
            <div className="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
                    <li>
                        <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="auto"
                            aria-pressed="false">
                            <svg className="bi me-2 opacity-50" aria-hidden="true">
                                <use href="#circle-half"></use>
                            </svg>
                            시스템
                            <svg className="bi ms-auto d-none" aria-hidden="true">
                                <use href="#check2"></use>
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>

            <main>
                <div className="container">
                    <h1>데이터 포맷</h1>
                    <p className="lead">Basic grid layouts to get you familiar with building within the Bootstrap grid system.</p>
                    <p>In these examples the <code>.themed-grid-col</code> class is added to the columns to add some theming.
                        This is not a class that is available in Bootstrap by default.</p>

                    <h2 className="mt-4">Log Format 관리</h2>
                    <p>There are five tiers to the Bootstrap grid system, one for each range of devices we support. Each tier
                        starts at a minimum viewport size and automatically applies to the larger devices unless overridden.</p>

                    <div className="row mb-0 text-center">
                        <div className="col-3 themed-grid-col">Format 명</div>
                        <div className="col-3 themed-grid-col">Format ID</div>
                        <div className="col-3 themed-grid-col">설명</div>
                        <div className="col-3 themed-grid-col">프로세스 이용여부</div>
                    </div>

                    <div className="row mb-0 text-center">
                        <div className="col-sm-3 themed-grid-col">[obzen Standard] App Log Format</div>
                        <div className="col-sm-3 themed-grid-col">1175119</div>
                        <div className="col-sm-3 themed-grid-col">App Log Standard Format</div>
                        <div className="col-sm-3 themed-grid-col">✔</div>
                    </div>

                    <div className="row mb-0 text-center">
                        <div className="col-md-3 themed-grid-col">[POC]IBK Data</div>
                        <div className="col-md-3 themed-grid-col">1180768</div>
                        <div className="col-md-3 themed-grid-col"></div>
                        <div className="col-md-3 themed-grid-col">⚪</div>
                    </div>

                    <div className="row mb-0 text-center">
                        <div className="col-lg-3 themed-grid-col">카드데이터</div>
                        <div className="col-lg-3 themed-grid-col">1187022</div>
                        <div className="col-lg-3 themed-grid-col"></div>
                        <div className="col-lg-3 themed-grid-col">⚪</div>
                    </div>

                    <div className="row mb-0 text-center">
                        <div className="col-xl-3 themed-grid-col">[Standard] WLSF_002</div>
                        <div className="col-xl-3 themed-grid-col">1060795</div>
                        <div className="col-xl-3 themed-grid-col">Web Log Standard Format 002 - BODY(O)</div>
                        <div className="col-xl-3 themed-grid-col">✔</div>
                    </div>

                    <div className="row mb-0 text-center">
                        <div className="col-xxl-3 themed-grid-col">.col-xxl-3</div>
                        <div className="col-xxl-3 themed-grid-col">.col-xxl-3</div>
                        <div className="col-xxl-3 themed-grid-col">.col-xxl-3</div>
                        <div className="col-xxl-3 themed-grid-col">추가</div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DataFormat2;
