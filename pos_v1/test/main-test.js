'use strict';

describe('pos', () => {
  it('get barcode and count',() => {
    let arrays = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2'
    ];
    let formatTags = getFormattedItems(arrays);
    let expected = [
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000001',
        count: 1
      },
      {
        barcode: 'ITEM000003',
        count: 2
      }
    ];

    expect(formatTags).toEqual(expected);
  });
  it('Delete Equal barcode and count add 1', () =>{
    let formatTags = [
      {
        barcode:'ITEM000001',
        count:1
      },
      {
        barcode:'ITEM000001',
        count:1
      },
      {
        barcode:'ITEM000001',
        count:1
      },
      {
        barcode:'ITEM000003',
        count:2
      }
    ]
    let countBarcodes = getCountBarcodes(formatTags);
    let expected = [
      {
        barcode: 'ITEM000001',
        count: 3
      },
      {
        barcode: 'ITEM000003',
        count: 2
      }
    ];

    expect(countBarcodes).toEqual(expected);

  });
  it('get item infomation', () =>{
    const allItems = loadAllItems();
    //const promotions = loadPromotions();
    let countBarcodes = [
      {
        barcode: 'ITEM000001',
        count: 3
      },
      {
        barcode: 'ITEM000003',
        count: 2
      }
    ];
    let cartItems = buildCartItems(countBarcodes,allItems);
    let expected = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 3
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2
      }
    ];
    expect(cartItems).toEqual(expected);
  });
  it('get promotion items infomations',() =>{
    //const promotions = loadPromotions();
    let cartItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 3
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2
      }
    ];
    let promotions = loadPromotions();
    let promotedItems = buildPromotedItems(cartItems,promotions);
    //let promotions = specsBuildPromotedItems(cartItems);
    let expected = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 3,
        payPrice: 6.00,
        saved: 3
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2,
        payPrice: 30.00,
        saved: 0
      }
    ];
    expect(promotedItems).toEqual(expected);
  });
  it('should pay total price', () =>{
    let promotionItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 3,
        payPrice: 6.00,
        saved: 3
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2,
        payPrice: 30.00,
        saved: 0
      }
    ];
    let totalPrices = calculateTotalPrices(promotionItems);
    let expected = {
      totalPayPrice: 36.00,
      totalSaved: 3.00
    };
    expect(totalPrices).toEqual(expected);
  });
  it('build Receipt model', () =>{
    let promotedItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        count: 3,
        payPrice: 6.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        count: 2,
        payPrice: 30.00
      }
    ];
    const totalPrices = {
      totalPayPrice: 36.00,
      totalSaved: 3.00
    };
    let receiptModel = buildReceipt(promotedItems,totalPrices);
    let expected = {
      receiptItems:[
        {
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          count: 3,
          payPrice: 6.00
        },
        {
          name: '荔枝',
          unit: '斤',
          price: 15.00,
          count: 2,
          payPrice: 30.00
        }
      ],
      totalPayPrice: 36.00,
      totalSaved: 3.00
    };
    expect(receiptModel).toEqual(expected);
  });
  it('should print text', () => {

    const tags = [
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

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
})
;
