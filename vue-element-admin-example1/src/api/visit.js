import request from '@/utils/request'

/*
  visitDate:{start:'2020-02-03',end:'2020-04-04'}
*/
export function getTableList(visitDate) {
  const d = request({
    baseURL: '/api',
    // baseURL:'https://4x27rwnpa5.execute-api.ap-southeast-1.amazonaws.com/prod/',
    url: 'admin/field-visit/getVisitsByDate',
    method: 'get',
    params: visitDate
  })
  console.log(d)
  return d
}
