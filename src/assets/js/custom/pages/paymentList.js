const paymentListPage = {
  title: "Payment List Page",
  vue: null,
  dataTable: null,
  listData: null,
  init: function (vue) {
    var thisInstance = this;
    thisInstance.vue = vue;
    thisInstance.dataTable = null;
  },
  setListData: function (data) {
    var thisInstance = this;
    thisInstance.listData = data;
    if(thisInstance.dataTable===undefined || thisInstance.dataTable===null) {
      thisInstance.createTable(thisInstance.listData);
    }else{
      if(data.length > 0) {
        var dataJSONArray = JSON.parse(JSON.stringify(data));
        for (var i = 0; i < dataJSONArray.length; i++) {
          dataJSONArray[i].status = dataJSONArray[i].active ? 4 : 6;
        }
        thisInstance.dataTable.dataSet = dataJSONArray;
        thisInstance.dataTable.originalDataSet = dataJSONArray;
        //thisInstance.dataTable.options.data.source = dataJSONArray;
        //thisInstance.dataTable.load();
        thisInstance.dataTable.reload();
        setTimeout(function () {
          thisInstance.tableListOnLoad();
        }, 1000);
      }
    }
  },
  createTable: function(params) {
    var thisInstance = this;
    thisInstance.dataJSONArray = JSON.parse(JSON.stringify(params));

    thisInstance.dataTable = $('.kt-datatable').KTDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: thisInstance.dataJSONArray,
        pageSize: 10,
      },
      // layout definition
      layout: {
        scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
        // height: 450, // datatable's body's fixed height
        footer: false, // display/hide footer
      },
      "order": [[ 0, "desc" ]],
      // column sorting
      sortable: true,
      pagination: true,
      search: {
        input: $('#generalSearch'),
      },
      // columns definition
      columns: [
        {
          field: 'id',
          title: '#',
          sortable: 'desc',
          width: 20,
          type: 'number',
          //selector: {class: 'kt-checkbox--solid'},
          textAlign: 'center',
        }, {
          field: 'cardFamily',
          title: 'Kart',
        }, {
          field: 'binNumber',
          title: 'Bin Numarası',
        }, {
          field: 'paymentType',
          title: 'Ödeme Tipi',
        }, {
          field: 'createDate',
          title: 'Tarih',
          type: 'date',
          format: 'MM/DD/YYYY',
          template: function (row) {
            return timestampToDateTime(row.createDate);
          }
        }, {
          field: 'installment',
          title: 'Taksit',
        }, {
          field: 'totalPrice',
          title: 'Tutar',
        }, {
          field: 'status',
          title: 'Durum',
          // callback function support for column rendering
          template: function(row, index, datatable) {
            // row.status row.fraudStatus row.transactionStatus
            // status:success fraudstatus:1 transactionstatus:2 olmalıdır.
            // console.debug(row);
            var status = {
              'success': {'title': 'Başarılı', 'class': 'kt-badge--success'},
              'failure': {'title': 'Başarısız', 'class': ' kt-badge--danger'},
            };
            var tmpStatus = "";
            if(row.status === "success" && row.fraudStatus === 1 && row.transactionStatus === 2){
              tmpStatus = "success";
            }else{
              tmpStatus = "failure";
            }
            row.status = tmpStatus;
            return '<span class="kt-badge ' + status[row.status].class + ' kt-badge--inline kt-badge--pill">' + status[row.status].title + '</span>';
          },
        }, {
          field: 'Actions',
          title: '',
          width: 30,
          overflow: 'visible',
          autoHide: false,
          template: function(row, index, datatable) {
            var retryHtml = "";
            if(row.status === "success" && row.fraudStatus === 1 && row.transactionStatus === 2){

            }else{
              if(row.paymentType === "SUBSCRIPTION"){
                retryHtml = '<a href="javascript:;" data-id="'+row.id+'"  data-conversation-id="'+row.conversationId+'" data-index="'+index+'"  class="btn btn-sm btn-clean btn-icon btn-icon-md paymentListRetryBtn" title="Ödeme Tekrarla">\
                  <i class="la la-credit-card"></i>\
                  </a>\
                ';
              }
            }
            return '\
              '+retryHtml+'<a href="javascript:;" data-id="'+row.id+'" data-index="'+index+'"  class="btn btn-sm btn-clean btn-icon btn-icon-md paymentListDetailBtn" title="Detay">\
                <i class="la la-info-circle"></i>\
              </a>\
            ';
          },
        }],
    });

    $('#kt_form_status').on('change', function() {
      thisInstance.dataTable.search($(this).val().toLowerCase(), 'status');
    });

    $('#kt_form_type').on('change', function() {
      thisInstance.dataTable.search($(this).val().toLowerCase(), 'Type');
    });

    $('#kt_form_status,#kt_form_type').selectpicker();

    $('.kt-datatable').on('kt-datatable--on-init', function() {
      console.log('Datatable init');
      thisInstance.tableListOnLoad();
    }).on('kt-datatable--on-layout-updated', function() {
      console.log('Layout render updated');
      thisInstance.tableListOnLoad();
    }).on('kt-datatable--on-ajax-done', function() {
      console.log('Ajax data successfully updated');
    }).on('kt-datatable--on-ajax-fail', function(e, jqXHR) {
      console.log('Ajax error');
    }).on('kt-datatable--on-goto-page', function(e, args) {
      console.log('Goto to pagination: ' + args.page);
    }).on('kt-datatable--on-update-perpage', function(e, args) {
      console.log('Update page size: ' + args.perpage);
    }).on('kt-datatable--on-reloaded', function(e) {
      console.log('Datatable reloaded');
    }).on('kt-datatable--on-check', function(e, args) {
      console.log('Checkbox active: ' + args.toString());
    }).on('kt-datatable--on-uncheck', function(e, args) {
      console.log('Checkbox inactive: ' + args.toString());
    }).on('kt-datatable--on-sort', function(e, args) {
      console.log('Datatable sorted by ' + args.field + ' ' + args.sort);
    });

    setTimeout(function () { thisInstance.tableListOnLoad(); }, 1000);

  },
  tableListOnLoad: function(){
    this.Detail();
  },
  Detail: function () {
    var thisInstance = this;
    $('.kt-datatable').find('.paymentListDetailBtn').off().on('click', function (e) {
      console.log("payment");
      e.preventDefault();
      var element = this;
      var modalData = thisInstance.getDataRow(element.dataset.id);
      if(modalData) {
        var customModal = $('#paymentListDetailModal');
        thisInstance.vue.$store.commit('payment/setPaymentDetailModalData', modalData);
        customModal.modal('show');
      }
    });

    $('.kt-datatable').find('.paymentListRetryBtn').off().on('click', function (e) {
      console.log("paymentListRetryBtn");
      e.preventDefault();
      var element = this;
      console.log(element.dataset.conversationId);
      thisInstance.vue.$store.dispatch("payment/retrySubscription", {"conversationId":element.dataset.conversationId});
    });
  },
  getDataRow: function (param) {
    var thisInstance = this;
    var result = thisInstance.dataJSONArray.filter(element => {
      if(element.id == param) {
        return element;
      }
    });
    if (result.length>0){
      return result[0];
    }
    return false;
  }
};

export default paymentListPage;
