import api from "./api";

// foot-traffic에 고정으로 들어가야 하는 analyNo
const ANALY_NO = 1143243;

/**
 * simple-anls(매출/점포 등) + foot-traffic(유동인구) 병렬 호출
 * 둘 다 성공하면 합쳐 반환, 하나 실패해도 가능한 데이터는 살려서 반환
 */
export default async function fetchMarketResult({
  admiCd,
  upjongCd,
  simpleLoc,
}) {
  const SIMPLE_PATH = "/simple-anls";
  const FOOT_PATH = "/foot-traffic";

  const [simpleRes, footRes] = await Promise.allSettled([
    api.get(SIMPLE_PATH, { params: { admiCd, upjongCd, simpleLoc } }),
    api.get(FOOT_PATH, { params: { analyNo: ANALY_NO, admiCd, upjongCd } }),
  ]);

  const simpleData =
    simpleRes.status === "fulfilled" ? simpleRes.value?.data : null;

  const footRaw = footRes.status === "fulfilled" ? footRes.value?.data : null;

  // 응답 형태가 { population: {...} } 또는 바로 {...} 일 수 있으니 안전하게 처리
  const population = footRaw?.population ?? footRaw ?? null;

  return {
    ...(simpleData || {}),
    population,
  };
}
