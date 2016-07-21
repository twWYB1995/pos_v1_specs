'use strict';
/*var items = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2',
  'ITEM000005',
  'ITEM000005',
  'ITEM000005'
];
function loadAllItems() {
  return [
    {
      barcode: 'ITEM000000',
      name: '可口可乐',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000002',
      name: '苹果',
      unit: '斤',
      price: 5.50
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00
    },
    {
      barcode: 'ITEM000004',
      name: '电池',
      unit: '个',
      price: 2.00
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50
    }
  ];
}
function loadPromotions() {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
      ]
    }
  ];
}
*/
function getCountItems(item) {
  var cnt = 1;
  var info = [];
  var items = item.sort();
  for(var i=0;i<items.length;i++){
    if(items[i]!=items[i+1]){
      var newJson={barcode:items[i],count:cnt};
      info.push(newJson);
      cnt=1;
    }else{
      cnt++;
    }
  }
  for(var i=0;i<info.length;i++){
    var json = info[i];
    if(json.barcode.indexOf("-")!=-1){
      var temps = json.barcode.split("-");
      info[i].barcode = temps[0];
      info[i].count = parseInt(json.count) + parseInt(temps[1])-1;
    }
    //console.log(info[i].barcode,info[i].count);
    //console.log(info[i]);
  }
  return info;
}
function getBuyedItems(countItems,allItems) {
  /*for(var i in countItems){
    for(var j in allItems){
      if(countItems[i].barcode=allItems[j].barcode){
        countItems[i]==allItems[j];
        console.log(countItems[i]);
      }
    }
  }*/
  var buyedItems = countItems;
  for(var i=0;i<buyedItems.length;i++){
    for(var j=0;j<allItems.length;j++){
      if(buyedItems[i].barcode==allItems[j].barcode){
        allItems[j].count=buyedItems[i].count;
        buyedItems[i]=allItems[j];
        //console.log(buyedItems[i]);
      }
    }
  }
  return buyedItems;
}
function getDiscounts(buyedItems,pomotions) {
  var discounts = buyedItems;
  for(var i=0;i<discounts.length;i++){
    for(var j=0;j<pomotions.length;j++){
      for(var k=0;k<pomotions[j].barcodes.length;k++){
      if(discounts[i].barcode == pomotions[j].barcodes[k]){
        discounts[i].type=pomotions[j].type;
      }
      }
    }
  }
  /*for(var i in discounts){
    console.log(discounts[i]);
  }*/
  return discounts;
}
function getTotals(discountItems) {
  var totals = discountItems;
  for(var i in totals){
    if(totals[i].type=='BUY_TWO_GET_ONE_FREE'){
      var thisMoney=parseInt((totals[i].count)/3)*totals[i].price*2+parseInt((totals[i].count)%3)*totals[i].price;
    }else {
      thisMoney=totals[i].count*totals[i].price;
    }
    totals[i].thisMoney=thisMoney;
  }
 /* for(var i in totals){
    console.log(totals[i]);
  }*/
  return totals;
}
function getFinallyPrintf(totals) {
  var finallys = totals;
  var finallyMoney = 0;
  var originalMoney = 0;
  var saveMoney = 0;
  var allInfos=[];
  var finallyPrintf = {};
  for(var i in finallys){
    originalMoney += finallys[i].count*finallys[i].price;
    finallyMoney += finallys[i].thisMoney;
    allInfos.push(finallys[i]);
    //console.log(infos[i]);
  }
  //console.log(originalMoney);
  //console.log(finallyMoney);
  saveMoney=originalMoney-finallyMoney;
  finallyPrintf.infos=allInfos;
  finallyPrintf.finallyMoney=finallyMoney;
  finallyPrintf.saveMoney=saveMoney;

  //console.log(finallyPrintf);
  return finallyPrintf;
}
function getPrintfNode(finallyPrintf) {
  var result = "***<没钱赚商店>收据***\n";
  //console.log("***<没钱赚商店>收据***");
  /*for(var i=0;i<finallyPrintf.infos.length;i++){
    printf += "名称: "+finallyPrintf.infos[i].name+", "
                +"数量: "+finallyPrintf.infos[i].count+finallyPrintf.infos[i].unit+", "
                +"单价: "+finallyPrintf.infos[i].price.toFixed(2)+"(元)"+", "
                +"小计: "+finallyPrintf.infos[i].thisMoney.toFixed(2)+"(元)\n";
    //console.log("数量:"+finallyPrintf.infos[i].count+"("+finallyPrintf.infos[i].unit+")");
   // console.log("单价:"+finallyPrintf.infos[i].price+"(元)");
   // console.log("小记:"+finallyPrintf.infos[i].thisMoney+"(元)");
  }
 printf+="----------------------\n"+"总计: "+finallyPrintf.finallyMoney.toFixed(2)+"(元)\n"+
              "节省: "+finallyPrintf.saveMoney.toFixed(2)+"(元)\n"+"**********************";
  //console.log("总计"+finallyPrintf.finallyMoney+"(元)");
  //console.log("节省"+finallyPrintf.saveMoney+"(元)");
  //console.log("**********************")
  return printf;*/
  var receipt = "";
  for(var i=0;i<finallyPrintf.infos.length;i++){
    receipt += `名称: ${finallyPrintf.infos[i].name}, 数量: ${finallyPrintf.infos[i].count}${finallyPrintf.infos[i].unit}, 单价: ${finallyPrintf.infos[i].price.toFixed(2)}(元), 小计: ${finallyPrintf.infos[i].thisMoney.toFixed(2)}(元)`;
    receipt += "\n";
    //console.log("数量:"+finallyPrintf.infos[i].count+"("+finallyPrintf.infos[i].unit+")");
    // console.log("单价:"+finallyPrintf.infos[i].price+"(元)");
    // console.log("小记:"+finallyPrintf.infos[i].thisMoney+"(元)");
  }
  return result = `***<没钱赚商店>收据***
${receipt}----------------------
总计: ${finallyPrintf.finallyMoney.toFixed(2)}(元)
节省: ${finallyPrintf.saveMoney.toFixed(2)}(元)
**********************`;
}

function printReceipt(tags) {

  var allItems = loadAllItems();
  var countItems = getCountItems(tags);
  var buyedItems = getBuyedItems(countItems, allItems);
  var pomotions = loadPromotions();
  var discountItems = getDiscounts(buyedItems, pomotions);
  var totals = getTotals(discountItems);
  var finallyPrintf = getFinallyPrintf(totals);
  var printfNode = getPrintfNode(finallyPrintf);
  console.log(printfNode);
}


//printReceipt();

