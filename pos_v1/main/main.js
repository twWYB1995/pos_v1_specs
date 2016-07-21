'use strict';

function printReceipt(tags) {
  let allItems = loadAllItems();
  let formatedItems = getFormattedItems(tags);
  let countBarcodes = getCountBarcodes(formatedItems);
  let cartItems = buildCartItems(countBarcodes,allItems);
  let promotions = loadPromotions();
  let promotedItems = buildPromotedItems(cartItems,promotions);
  let totalPrices = calculateTotalPrices(promotedItems);
  let receiptModel = buildReceipt(promotedItems,totalPrices);
  let receipt = buildReceiptString(receiptModel);

  console.log(receipt);
}
function getFormattedItems(tags) {
  let result = [];
  for(let tag of tags){
    if(tag.indexOf("-") === -1){
      result.push({barcode: tag,count: 1});
    }else{
      let temps = tag.split("-");
      result.push({barcode: temps[0],count: parseInt(temps[1])});
    }
  }
  return result;
}

function getCountBarcodes(formatedItems) {
  let result = [];
  for(let formatedItem of formatedItems){
    let element = getExitedElementByBarcode(result,formatedItem.barcode);
    if(element === null){
      result.push({
        barcode: formatedItem.barcode,
        count: formatedItem.count
      });
    }else{
      element.count+=formatedItem.count;
    }
  }
  return result;
}

function buildCartItems(countBarcodes,allItems) {
  let result = [];
  for(let countBarcode of countBarcodes){
    let item = getExitedElementByBarcode(allItems,countBarcode.barcode);
    result.push({
      barcode: item.barcode,
      name: item.name,
      unit: item.unit,
      price: item.price,
      count: countBarcode.count
    });

  }
  return result;
}
function buildPromotedItems(cartItems,promotions) {
  let result = [];
  let firstpromoted = promotions[0];
  for(let cartItem of cartItems){
    let saved = 0;
    let hasPromoted = false;
    for(let barcode of firstpromoted.barcodes){
      if(cartItem.barcode === barcode){
        hasPromoted = true;
      }
    }
    if(firstpromoted.type === "BUY_TWO_GET_ONE_FREE" && hasPromoted){
      var savedCount = Math.floor(cartItem.count/3);
      saved = savedCount * cartItem.price;
    }
    let payPrice = cartItem.count * cartItem.price - saved;
    result.push({
      barcode: cartItem.barcode,
      name: cartItem.name,
      unit: cartItem.unit,
      price: cartItem.price,
      count: cartItem.count,
      payPrice: payPrice,
      saved
    });
  }
  return result;
}

function calculateTotalPrices(promotedItems) {
  let result = {
    totalPayPrice: 0,
    totalSaved: 0
  };
  for(let promotedItem of promotedItems){
      result.totalPayPrice += promotedItem.payPrice;
      result.totalSaved += promotedItem.saved;
  }
  return result;
}

function buildReceipt(promotedItems,totalPrices) {
  let receiptItems = [];
  for(let element of promotedItems){
    receiptItems.push({
      name: element.name,
      unit: element.unit,
      price: element.price,
      count: element.count,
      payPrice: element.payPrice
    });
  }
  return {
    receiptItems,
    totalPayPrice: totalPrices.totalPayPrice,
    totalSaved: totalPrices.totalSaved
  }
}

function buildReceiptString(receiptModel) {
  let totalPayPrice = receiptModel.totalPayPrice;
  let saved = receiptModel.totalSaved;
  let receiptItemsString = "";
  for(let receiptItem of receiptModel.receiptItems){
    receiptItemsString += `名称：${receiptItem.name}，数量：${receiptItem.count}${receiptItem.unit}，单价：${receiptItem.price.toFixed(2)}(元)，小计：${receiptItem.payPrice.toFixed(2)}(元)`;
    receiptItemsString += "\n";
  }
  const result = `***<没钱赚商店>收据***
${receiptItemsString}----------------------
总计：${totalPayPrice.toFixed(2)}(元)
节省：${saved.toFixed(2)}(元)
**********************`;
  return result;
}

function getExitedElementByBarcode(arrays,barcode) {
  for(let array of arrays){
    if(array.barcode === barcode){
      return array;
    }
  }
  return null;
}
