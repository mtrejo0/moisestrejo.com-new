"use client";

import { useState } from "react";

const DailyBudget = () => {
  const [salary, setSalary] = useState(100000);
  const [taxRate, setTaxRate] = useState(25);
  const [usePreTax, setUsePreTax] = useState(false);
  const [needsItems, setNeedsItems] = useState([]);
  const [wantsItems, setWantsItems] = useState([]);
  const [savingsItems, setSavingsItems] = useState([]);
  const [newItem, setNewItem] = useState({
    category: "needs",
    name: "",
    amount: "",
  });

  const calculatePostTax = () => {
    const postTaxYearly = salary * (1 - taxRate / 100);
    const postTaxMonthly = postTaxYearly / 12;
    const postTaxDaily = postTaxYearly / 365;
    return {
      yearly: postTaxYearly,
      monthly: postTaxMonthly,
      daily: postTaxDaily,
    };
  };

  const calculateBudget = (monthlyAmount) => {
    const needs = monthlyAmount * 0.5;
    const wants = monthlyAmount * 0.3;
    const savings = monthlyAmount * 0.2;
    const housing = needs * 0.6; // 30% of total = 60% of needs category
    const otherNeeds = needs * 0.4; // Remaining needs

    return {
      needs: { total: needs, housing, otherNeeds },
      wants,
      savings,
    };
  };

  const postTax = calculatePostTax();
  const monthlyAmount = usePreTax ? salary / 12 : postTax.monthly;
  const budget = calculateBudget(monthlyAmount);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.amount) return;

    const item = {
      name: newItem.name,
      amount: parseFloat(newItem.amount),
    };

    switch (newItem.category) {
      case "needs":
        setNeedsItems([...needsItems, item]);
        break;
      case "wants":
        setWantsItems([...wantsItems, item]);
        break;
      case "savings":
        setSavingsItems([...savingsItems, item]);
        break;
    }

    setNewItem({ category: "needs", name: "", amount: "" });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleDeleteItem = (category, index) => {
    switch (category) {
      case "needs":
        setNeedsItems(needsItems.filter((_, i) => i !== index));
        break;
      case "wants":
        setWantsItems(wantsItems.filter((_, i) => i !== index));
        break;
      case "savings":
        setSavingsItems(savingsItems.filter((_, i) => i !== index));
        break;
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Budget Calculator</h1>

      <div className="w-full space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Salary: ${salary.toLocaleString()}
          </label>
          <input
            type="range"
            min="0"
            max="500000"
            step="1000"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax Rate: {taxRate}%
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Calculate budget using:
          </label>
          <button
            onClick={() => setUsePreTax(false)}
            className={`px-3 py-1 rounded ${!usePreTax ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Post-Tax
          </button>
          <button
            onClick={() => setUsePreTax(true)}
            className={`px-3 py-1 rounded ${usePreTax ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Pre-Tax
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Post-Tax Income</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-medium">Yearly</div>
              <div className="text-lg">
                $
                {postTax.yearly.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium">Monthly</div>
              <div className="text-lg">
                $
                {postTax.monthly.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium">Daily</div>
              <div className="text-lg">
                $
                {postTax.daily.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold">
            Budget Breakdown ({usePreTax ? "Pre" : "Post"}-Tax)
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg font-bold text-xl">Monthly</h3>
              <div className="pl-4 space-y-2">
                <div>
                  <div className="font-medium">Needs (50%)</div>
                  <div className="pl-4">
                    <div>
                      Housing (30%): $
                      {budget.needs.housing.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div>
                      Other Needs (20%): $
                      {budget.needs.otherNeeds.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div className="mt-1 font-medium">
                      Total Needs: $
                      {(
                        budget.needs.housing + budget.needs.otherNeeds
                      ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-medium">Wants (30%)</div>
                  <div className="pl-4">
                    $
                    {budget.wants.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Investing/Savings (20%)</div>
                  <div className="pl-4">
                    $
                    {budget.savings.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg font-bold text-xl">Weekly</h3>
              <div className="pl-4 space-y-2">
                <div>
                  <div className="font-medium">Needs (50%)</div>
                  <div className="pl-4">
                    <div>
                      Housing (30%): $
                      {(budget.needs.housing / 4).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div>
                      Other Needs (20%): $
                      {(budget.needs.otherNeeds / 4).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-medium">Wants (30%)</div>
                  <div className="pl-4">
                    $
                    {(budget.wants / 4).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Investing/Savings (20%)</div>
                  <div className="pl-4">
                    $
                    {(budget.savings / 4).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg font-bold text-xl">Daily</h3>
              <div className="pl-4 space-y-2">
                <div>
                  <div className="font-medium">Needs (50%)</div>
                  <div className="pl-4">
                    <div>
                      Housing (30%): $
                      {(budget.needs.housing / 30).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div>
                      Other Needs (20%): $
                      {(budget.needs.otherNeeds / 30).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 },
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Wants (30%)</div>
                  <div className="pl-4">
                    $
                    {(budget.wants / 30).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Investing/Savings (20%)</div>
                  <div className="pl-4">
                    $
                    {(budget.savings / 30).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Monthly Expense Tracker</h2>

          <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
            <select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="p-2 border rounded"
            >
              <option value="needs">Needs</option>
              <option value="wants">Wants</option>
              <option value="savings">Savings</option>
            </select>
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="p-2 border rounded flex-1"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newItem.amount}
              onChange={(e) =>
                setNewItem({ ...newItem, amount: e.target.value })
              }
              className="p-2 border rounded w-24"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </form>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">Needs</h3>
              <ul className="space-y-1">
                {needsItems.map((item, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span>${item.amount}</span>
                      <button
                        onClick={() => handleDeleteItem("needs", i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t">
                <div className="font-medium">
                  Total: ${calculateTotal(needsItems)}
                </div>
                <div className="text-sm text-gray-500">
                  Budget: $
                  {budget.needs.total.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Wants</h3>
              <ul className="space-y-1">
                {wantsItems.map((item, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span>${item.amount}</span>
                      <button
                        onClick={() => handleDeleteItem("wants", i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t">
                <div className="font-medium">
                  Total: ${calculateTotal(wantsItems)}
                </div>
                <div className="text-sm text-gray-500">
                  Budget: $
                  {budget.wants.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Savings</h3>
              <ul className="space-y-1">
                {savingsItems.map((item, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span>${item.amount}</span>
                      <button
                        onClick={() => handleDeleteItem("savings", i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t">
                <div className="font-medium">
                  Total: ${calculateTotal(savingsItems)}
                </div>
                <div className="text-sm text-gray-500">
                  Budget: $
                  {budget.savings.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyBudget;
