import api from "./api";

// foot-traffic에 고정으로 들어가야 하는 analyNo
const ANALY_NO = 1143243;

/**
 * simple-anls(매출/점포 등) + foot-traffic(유동인구) 병렬 호출
 * 둘 다 성공하면 합쳐 반환, 하나 실패해도 가능한 데이터는 살려서 반환
 */
const marketResultApi = async ({ admiCd, upjongCd, simpleLoc }) => {
  const SIMPLE_PATH = "/simple-anls";
  const FOOT_PATH = "/foot-traffic";

  // API URL에 맞는 형식으로 fullLoc 변경
  const fullLoc = `경상북도+경산시+${simpleLoc}`;

  const [simpleRes, footRes] = await Promise.allSettled([
    // 수정된 fullLoc 변수를 사용
    api.get(SIMPLE_PATH, { params: { admiCd, upjongCd, simpleLoc: fullLoc } }),
    api.get(FOOT_PATH, { params: { analyNo: ANALY_NO, admiCd, upjongCd } }),
  ]);

  // console.log(simpleRes);
  // console.log(footRes);

  const simpleData =
    simpleRes.status === "fulfilled" ? simpleRes.value?.data : null;

  const footRaw = footRes.status === "fulfilled" ? footRes.value?.data : null;

  const population = footRaw?.population ?? footRaw ?? null;

  return {
    ...(simpleData || {}),
    population,
  };
};

export default marketResultApi;
