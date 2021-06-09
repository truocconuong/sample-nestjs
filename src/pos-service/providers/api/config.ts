
const apiUrls = {
  /**
   * note: all urls is example, please replace with matching url from api.
   */
  raptor: {
    checkConnection(baseURLRaptor: string){
      return `${baseURLRaptor}/heartbeat`;
    },
    authen(baseURLRaptor: string) {
      return `${baseURLRaptor}/token`;
    },
    openTable(baseURLRaptor: string) {
      return `${baseURLRaptor}/order/open_table`;
    },
    orderItem(baseURLRaptor: string) {
      return `${baseURLRaptor}/order/order_item`;
    },
    orderModifier(baseURLRaptor: string) {
      return `${baseURLRaptor}/order/order_modifier`;
    },
    setMenu(baseURLRaptor: string) {
      return `${baseURLRaptor}/order/set_menu`;
    },
    holdTable(baseURLRaptor: string) {
      return `${baseURLRaptor}/order/hold_table`;
    },
    recallTable(baseURLRaptor: string) {
      return `${baseURLRaptor}/order/recall_table`;
    },
    getOpenTableList(baseURLRaptor: string) {
      return `${baseURLRaptor}//order/open_table_list`;
    },
    closeSeason(baseURLRaptor: string){
      return `${baseURLRaptor}/payment/close_Session`;
    },
    prepItem(baseURLRaptor: string) {
      return `${baseURLRaptor}/order/prep_item`;
    },
    printBill(baseURLRaptor: string) {
      return `${baseURLRaptor}/payment/printbill`;
    },
  },
}

export default apiUrls;
