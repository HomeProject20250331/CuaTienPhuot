# Payment Formulas - Ứng dụng CuaTienPhuot

## Tổng quan

Tài liệu này mô tả các công thức tính toán và thuật toán chia tiền chi tiêu trong ứng dụng CuaTienPhuot. Các công thức này đảm bảo tính chính xác và công bằng trong việc phân chia chi phí giữa các thành viên trong nhóm du lịch.

## 1. Các loại công thức chia tiền

### 1.1 Equal Split (Chia đều)

#### Công thức cơ bản

```
Amount per person = Total Amount / Number of Participants
```

#### Ví dụ

- Tổng chi phí: 1,000,000 VNĐ
- Số người tham gia: 4 người
- Mỗi người phải trả: 1,000,000 / 4 = 250,000 VNĐ

#### Trường hợp có số dư

```
Base Amount = Floor(Total Amount / Number of Participants)
Remainder = Total Amount - (Base Amount × Number of Participants)
```

**Phân phối số dư:**

- Số dư được phân phối cho những người đầu tiên trong danh sách
- Mỗi người nhận thêm 1 VNĐ cho đến khi hết số dư

#### Ví dụ với số dư

- Tổng chi phí: 1,000,000 VNĐ
- Số người: 3 người
- Base Amount: Floor(1,000,000 / 3) = 333,333 VNĐ
- Remainder: 1,000,000 - (333,333 × 3) = 1 VNĐ
- Kết quả: 2 người trả 333,333 VNĐ, 1 người trả 333,334 VNĐ

### 1.2 Proportional Split (Chia theo tỷ lệ)

#### Công thức cơ bản

```
Amount per person = (Person's Weight / Total Weight) × Total Amount
```

#### Ví dụ

- Tổng chi phí: 1,200,000 VNĐ
- Người A: weight = 1.0
- Người B: weight = 1.5
- Người C: weight = 0.5
- Total Weight = 1.0 + 1.5 + 0.5 = 3.0

**Tính toán:**

- Người A: (1.0 / 3.0) × 1,200,000 = 400,000 VNĐ
- Người B: (1.5 / 3.0) × 1,200,000 = 600,000 VNĐ
- Người C: (0.5 / 3.0) × 1,200,000 = 200,000 VNĐ

### 1.3 Item-based Split (Chia theo món)

#### Công thức

```
Amount per person = Sum of (Item Amount × Person's Share in Item)
```

#### Ví dụ

- Món A: 300,000 VNĐ (A: 50%, B: 50%)
- Món B: 200,000 VNĐ (A: 100%)
- Món C: 500,000 VNĐ (B: 60%, C: 40%)

**Tính toán:**

- A: (300,000 × 0.5) + (200,000 × 1.0) + (500,000 × 0.0) = 350,000 VNĐ
- B: (300,000 × 0.5) + (200,000 × 0.0) + (500,000 × 0.6) = 450,000 VNĐ
- C: (300,000 × 0.0) + (200,000 × 0.0) + (500,000 × 0.4) = 200,000 VNĐ

## 2. Thuật toán Settlement (Thanh toán)

### 2.1 Debt Calculation (Tính toán nợ)

#### Công thức tính nợ

```
Debt = Amount Owed - Amount Paid
```

#### Ma trận nợ

```
Debt[i][j] = Amount that person i owes to person j
```

#### Ví dụ

- A đã trả: 400,000 VNĐ, phải trả: 300,000 VNĐ
- B đã trả: 200,000 VNĐ, phải trả: 500,000 VNĐ
- C đã trả: 100,000 VNĐ, phải trả: 200,000 VNĐ

**Kết quả:**

- A: +100,000 VNĐ (được nhận)
- B: -300,000 VNĐ (nợ)
- C: -100,000 VNĐ (nợ)

### 2.2 Optimal Settlement Algorithm

#### Thuật toán Minimize Transactions

```
1. Calculate net amounts for each person
2. Sort people by net amount (creditors first, then debtors)
3. Use greedy algorithm to minimize transactions
```

#### Pseudocode

```
function minimizeTransactions(netAmounts):
    creditors = [person for person in netAmounts if netAmounts[person] > 0]
    debtors = [person for person in netAmounts if netAmounts[person] < 0]

    transactions = []
    i = 0, j = 0

    while i < len(creditors) and j < len(debtors):
        creditor = creditors[i]
        debtor = debtors[j]

        amount = min(netAmounts[creditor], abs(netAmounts[debtor]))

        if amount > 0:
            transactions.append({
                'from': debtor,
                'to': creditor,
                'amount': amount
            })

            netAmounts[creditor] -= amount
            netAmounts[debtor] += amount

            if netAmounts[creditor] == 0:
                i += 1
            if netAmounts[debtor] == 0:
                j += 1

    return transactions
```

#### Ví dụ thực tế

**Net amounts:**

- A: +150,000 VNĐ
- B: -100,000 VNĐ
- C: -50,000 VNĐ

**Optimal transactions:**

1. C trả A: 50,000 VNĐ
2. B trả A: 100,000 VNĐ

**Kết quả:** 2 giao dịch thay vì 3 giao dịch có thể có

## 3. Các trường hợp đặc biệt

### 3.1 Partial Payments (Thanh toán một phần)

#### Công thức

```
Remaining Amount = Original Amount - Partial Payment
New Split = Remaining Amount / Remaining Participants
```

#### Ví dụ

- Tổng chi phí: 1,000,000 VNĐ
- A đã trả trước: 300,000 VNĐ
- Còn lại: 700,000 VNĐ
- Số người còn lại: 3 người
- Mỗi người còn lại phải trả: 700,000 / 3 = 233,333 VNĐ

### 3.2 Refunds (Hoàn tiền)

#### Công thức hoàn tiền

```
Refund Amount = (Person's Payment - Person's Share) × Refund Percentage
```

#### Ví dụ

- A đã trả: 400,000 VNĐ
- A phải trả: 300,000 VNĐ
- Hoàn tiền 50%: (400,000 - 300,000) × 0.5 = 50,000 VNĐ

### 3.3 Currency Conversion (Chuyển đổi tiền tệ)

#### Công thức

```
Amount in VND = Amount in Foreign Currency × Exchange Rate
```

#### Ví dụ

- Chi phí: 100 USD
- Tỷ giá: 24,000 VNĐ/USD
- Số tiền VNĐ: 100 × 24,000 = 2,400,000 VNĐ

#### Lưu ý về làm tròn

```
Rounded Amount = Round(Amount × Exchange Rate, 0)
```

### 3.4 Tax and Service Charges (Thuế và phí dịch vụ)

#### Công thức tính thuế

```
Tax Amount = Base Amount × Tax Rate
Total Amount = Base Amount + Tax Amount
```

#### Ví dụ

- Chi phí gốc: 1,000,000 VNĐ
- Thuế VAT: 10%
- Thuế: 1,000,000 × 0.1 = 100,000 VNĐ
- Tổng cộng: 1,000,000 + 100,000 = 1,100,000 VNĐ

#### Phí dịch vụ

```
Service Charge = Base Amount × Service Rate
Final Amount = Base Amount + Tax + Service Charge
```

## 4. Validation và Error Handling

### 4.1 Input Validation

#### Kiểm tra số tiền

```
function validateAmount(amount):
    if amount < 0:
        return "Số tiền không được âm"
    if amount > MAX_AMOUNT:
        return "Số tiền vượt quá giới hạn"
    if not isNumber(amount):
        return "Số tiền phải là số hợp lệ"
    return null
```

#### Kiểm tra tỷ lệ

```
function validateRatio(ratios):
    totalRatio = sum(ratios)
    if abs(totalRatio - 1.0) > 0.001:
        return "Tổng tỷ lệ phải bằng 1"
    for ratio in ratios:
        if ratio < 0:
            return "Tỷ lệ không được âm"
    return null
```

### 4.2 Precision Handling

#### Làm tròn số tiền

```
function roundAmount(amount, precision = 0):
    return Math.round(amount * Math.pow(10, precision)) / Math.pow(10, precision)
```

#### Xử lý số dư

```
function distributeRemainder(amounts, remainder):
    for i in range(remainder):
        amounts[i % len(amounts)] += 1
    return amounts
```

## 5. Công thức cho các tính năng nâng cao

### 5.1 Recurring Expenses (Chi phí định kỳ)

#### Công thức tính tổng

```
Total Recurring = Base Amount × Number of Occurrences
```

#### Ví dụ

- Chi phí hàng ngày: 200,000 VNĐ
- Số ngày: 5 ngày
- Tổng: 200,000 × 5 = 1,000,000 VNĐ

### 5.2 Group Discounts (Giảm giá nhóm)

#### Công thức

```
Discount Amount = Base Amount × Discount Rate
Final Amount = Base Amount - Discount Amount
```

#### Ví dụ

- Chi phí gốc: 2,000,000 VNĐ
- Giảm giá nhóm: 10%
- Giảm: 2,000,000 × 0.1 = 200,000 VNĐ
- Cuối cùng: 2,000,000 - 200,000 = 1,800,000 VNĐ

### 5.3 Multi-currency Support

#### Công thức chuyển đổi

```
function convertCurrency(amount, fromCurrency, toCurrency, exchangeRates):
    if fromCurrency == toCurrency:
        return amount

    baseAmount = amount / exchangeRates[fromCurrency]
    return baseAmount * exchangeRates[toCurrency]
```

#### Ví dụ

- Số tiền: 100 USD
- Chuyển sang VNĐ
- Tỷ giá USD/VND: 24,000
- Kết quả: 100 × 24,000 = 2,400,000 VNĐ

## 6. Performance Optimization

### 6.1 Caching Strategies

#### Cache calculation results

```
function getCachedCalculation(expenseId, participants):
    cacheKey = `calculation_${expenseId}_${participants.join('_')}`
    return cache.get(cacheKey)
```

#### Invalidate cache on changes

```
function invalidateCalculationCache(expenseId):
    cache.deletePattern(`calculation_${expenseId}_*`)
```

### 6.2 Batch Processing

#### Xử lý nhiều chi phí cùng lúc

```
function batchCalculate(expenses):
    results = []
    for expense in expenses:
        result = calculateExpense(expense)
        results.append(result)
    return results
```

## 7. Testing Formulas

### 7.1 Unit Tests

#### Test equal split

```javascript
describe("Equal Split", () => {
  test("should split amount equally", () => {
    const result = equalSplit(1000, 4);
    expect(result).toEqual([250, 250, 250, 250]);
  });

  test("should handle remainder", () => {
    const result = equalSplit(1000, 3);
    expect(result).toEqual([333, 333, 334]);
  });
});
```

#### Test proportional split

```javascript
describe("Proportional Split", () => {
  test("should split proportionally", () => {
    const weights = [1, 2, 1];
    const result = proportionalSplit(1000, weights);
    expect(result).toEqual([250, 500, 250]);
  });
});
```

### 7.2 Integration Tests

#### Test settlement algorithm

```javascript
describe("Settlement Algorithm", () => {
  test("should minimize transactions", () => {
    const netAmounts = {
      A: 150,
      B: -100,
      C: -50,
    };
    const transactions = minimizeTransactions(netAmounts);
    expect(transactions.length).toBe(2);
  });
});
```

## 8. Error Scenarios và Handling

### 8.1 Division by Zero

#### Xử lý khi không có người tham gia

```
function safeDivide(numerator, denominator):
    if denominator == 0:
        return 0
    return numerator / denominator
```

### 8.2 Overflow Handling

#### Kiểm tra giới hạn số

```
function checkOverflow(amount):
    if amount > MAX_SAFE_INTEGER:
        throw new Error('Số tiền quá lớn')
    return amount
```

### 8.3 Precision Loss

#### Sử dụng BigNumber cho tính toán chính xác

```
const BigNumber = require('bignumber.js');

function preciseCalculation(amount1, amount2, operation):
    const bn1 = new BigNumber(amount1);
    const bn2 = new BigNumber(amount2);

    switch(operation):
        case 'add': return bn1.plus(bn2).toNumber();
        case 'subtract': return bn1.minus(bn2).toNumber();
        case 'multiply': return bn1.times(bn2).toNumber();
        case 'divide': return bn1.div(bn2).toNumber();
```

## 9. Business Rules

### 9.1 Minimum Amount Rules

#### Số tiền tối thiểu

```
MINIMUM_AMOUNT = 1000; // 1,000 VNĐ
function validateMinimumAmount(amount):
    if amount < MINIMUM_AMOUNT:
        return "Số tiền tối thiểu là 1,000 VNĐ"
    return null
```

### 9.2 Maximum Participants

#### Giới hạn số người tham gia

```
MAX_PARTICIPANTS = 50;
function validateParticipants(count):
    if count > MAX_PARTICIPANTS:
        return "Tối đa 50 người tham gia"
    if count < 1:
        return "Cần ít nhất 1 người tham gia"
    return null
```

### 9.3 Rounding Rules

#### Quy tắc làm tròn

```
function applyRoundingRules(amount):
    // Làm tròn đến hàng nghìn
    return Math.round(amount / 1000) * 1000;
```

## 10. API Integration

### 10.1 Calculation Endpoints

#### POST /api/expenses/calculate

```json
{
  "amount": 1000000,
  "splitType": "equal",
  "participants": ["user1", "user2", "user3", "user4"]
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "totalAmount": 1000000,
    "splitAmount": 250000,
    "participants": [
      { "userId": "user1", "amount": 250000 },
      { "userId": "user2", "amount": 250000 },
      { "userId": "user3", "amount": 250000 },
      { "userId": "user4", "amount": 250000 }
    ]
  }
}
```

### 10.2 Settlement Endpoints

#### GET /api/expenses/{id}/settlement

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "from": "user2",
        "to": "user1",
        "amount": 100000
      },
      {
        "from": "user3",
        "to": "user1",
        "amount": 50000
      }
    ],
    "totalTransactions": 2
  }
}
```

## Kết luận

Các công thức và thuật toán được mô tả trong tài liệu này đảm bảo tính chính xác, công bằng và hiệu quả trong việc chia tiền chi tiêu nhóm. Việc áp dụng các công thức này sẽ giúp ứng dụng CuaTienPhuot cung cấp trải nghiệm tốt nhất cho người dùng trong việc quản lý chi phí du lịch nhóm.
