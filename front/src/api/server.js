import service from '@/api/http';


//get random usable seed
export const randomUsableSeed = (address) => {
  return service.get(`/seed/randomUsableSeed?address=${address}`);
};

//save order
export const saveOrder = (address, feeRate) => {
  return service.post(`/order/save`, { address, feeRate });
};

//execute order
export const executeOrder = (orderId) => {
  return service.post(`/order/execute`, { orderId });
};

//whitelist validate
export const whiteListValidate = (address) => {
  return service.get(`/whitelist/validate`, { address });
};


export const pageLatest = (pageParam) => {
    return service.get(`/inscriptions/latest`, pageParam);
};

