
import AdmnMenu from './AdmnMenu';


//관리자 페이지
const AdmnPage = () => {
  return (<div>

    <div>

      <header style={{ marginTop: '80px' }}>        {/* 간격조정 */}

      </header>

      <AdmnMenu />



      <footer className="text-body-secondary py-5">
        <div className="container">
          <p className="float-end mb-1">
            <a type="button" href="/">Back to Top</a>
          </p>
          <p className="mb-1">Album example is © Bootstrap, customize it as you like!</p>
          <p className="mb-0">
            New to Bootstrap? <a href="/">Visit the homepage</a> or read the{" "}
            <a href="/docs/5.3/getting-started/introduction/">getting started guide</a>.
          </p>
        </div>
      </footer>
    </div>
  </div>
  );
}

export default AdmnPage;