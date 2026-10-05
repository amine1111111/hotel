ALTER TABLE "RoomType" ADD COLUMN "displayOrder" INTEGER;

UPDATE "RoomType"
SET "displayOrder" = CASE "id"
  WHEN 'standard-single' THEN 1
  WHEN 'standard-double' THEN 2
  WHEN 'executive-sea-view' THEN 3
  WHEN 'honeymoon-package' THEN 4
  WHEN 'deluxe-sea-view' THEN 5
  ELSE 999
END;

ALTER TABLE "RoomType"
ALTER COLUMN "displayOrder" SET NOT NULL;