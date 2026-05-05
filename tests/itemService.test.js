import { ItemService } from "../src/services/itemService.js";

describe("ItemService", () => {
  let createdItemId;

  // Test create item
  test("createItem - Should create a new item", async () => {
    const itemData = {
      itemCode: "TEST-ITEM-001",
      itemName: "Test Item",
      category: "Test",
      quantity: 10,
      location: "Test Location",
    };

    const item = await ItemService.createItem(itemData);

    expect(item).toBeDefined();
    expect(item.itemCode).toBe(itemData.itemCode);
    expect(item.itemName).toBe(itemData.itemName);
    expect(item.quantity).toBe(itemData.quantity);

    createdItemId = item.id;
  });

  // Test get item by ID
  test("getItemById - Should find item by ID", async () => {
    const item = await ItemService.getItemById(createdItemId);

    expect(item).toBeDefined();
    expect(item.id).toBe(createdItemId);
  });

  // Test get item by code
  test("getItemByCode - Should find item by code", async () => {
    const item = await ItemService.getItemByCode("TEST-ITEM-001");

    expect(item).toBeDefined();
    expect(item.itemCode).toBe("TEST-ITEM-001");
  });

  // Test get all items
  test("getAllItems - Should return paginated items", async () => {
    const { items, total } = await ItemService.getAllItems(0, 10);

    expect(Array.isArray(items)).toBe(true);
    expect(total).toBeGreaterThan(0);
  });

  // Test get available items
  test("getAvailableItems - Should return only available items", async () => {
    const { items, total } = await ItemService.getAvailableItems(0, 10);

    expect(Array.isArray(items)).toBe(true);
    items.forEach((item) => {
      expect(item.status).toBe("TERSEDIA");
      expect(item.quantity).toBeGreaterThan(0);
    });
  });

  // Test get items by category
  test("getItemsByCategory - Should filter items by category", async () => {
    const { items, total } = await ItemService.getItemsByCategory(
      "Elektronik",
      0,
      10,
    );

    expect(Array.isArray(items)).toBe(true);
    items.forEach((item) => {
      expect(item.category).toBe("Elektronik");
    });
  });

  // Test get damaged items
  test("getDamagedItems - Should return only damaged items", async () => {
    const { items, total } = await ItemService.getDamagedItems(0, 10);

    expect(Array.isArray(items)).toBe(true);
    items.forEach((item) => {
      expect(item.condition).toBe("RUSAK");
    });
  });

  // Test search items
  test("searchItems - Should search items by name", async () => {
    const { items, total } = await ItemService.searchItems("Laptop", 0, 10);

    expect(Array.isArray(items)).toBe(true);
  });

  // Test update item
  test("updateItem - Should update item data", async () => {
    const updatedItem = await ItemService.updateItem(createdItemId, {
      itemName: "Updated Item Name",
      quantity: 15,
    });

    expect(updatedItem).toBeDefined();
    expect(updatedItem.itemName).toBe("Updated Item Name");
    expect(updatedItem.quantity).toBe(15);
  });

  // Test item statistics
  test("getItemStatistics - Should return item statistics", async () => {
    const stats = await ItemService.getItemStatistics();

    expect(stats).toBeDefined();
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.available).toBeDefined();
    expect(stats.borrowed).toBeDefined();
    expect(stats.damaged).toBeDefined();
    expect(stats.byCategory).toBeDefined();
  });

  // Test delete item
  test("deleteItem - Should delete item", async () => {
    const deleted = await ItemService.deleteItem(createdItemId);

    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(createdItemId);
  });
});
