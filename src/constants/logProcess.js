/**
 * 로그 프로세스 이름(=프로세스 코드) 형식. 영문자로 시작하는 영숫자만 허용한다 (예: View, ListClick).
 * 이름이 MTM dimension10 → Fluentd 정규식(\w+) → 백엔드 코드 조회로 그대로 흘러가므로
 * 공백·한글·특수문자가 들어가면 URL 쿼리에서 깨진다. 백엔드 CODE_PATTERN과 동일하게 유지한다.
 */
export const LOG_PROCESS_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9]*$/;

export const LOG_PROCESS_NAME_GUIDE = "영문자로 시작하는 영문·숫자 조합만 사용할 수 있습니다. (예: View, ListClick)";

export const isValidLogProcessName = (name) => LOG_PROCESS_NAME_PATTERN.test(name);
