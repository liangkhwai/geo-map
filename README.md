# GEO-MAP

## Table of Contents

- [Introduction](#introduce)
- [Getting Started](#getting-started)
- [Places](#places)
  - [Schema](#schema)
  - [Endpoints](#endpoint)
    - [POST Create Place](#1-create-place-post-places)
    - [GET Find all Places](#2-find-all-place-get-places)
    - [GET Find one Place](#3-find-one-place-get-placesid)
    - [GET Find all Place by name](#4-find-all-place-name-get-placescity)
    - [GET Find all Zone by name](#5-find-all-place-name-get-placeszone)
    - [PATCH Update Place](#6-update-place-patch-placesid)
    - [DELETE Place](#7-delete-place-delete-placesid)
- [Markers](#markers)
  - [Schema](#schema-1)
  - [Endpoints](#endpoint-1)
    - [POST Create Marker](#1-create-marker-post-markers)
    - [GET Find all Markers with Pagination](#2-find-all-marker-pagination-get-markersprivateadmindata)
    - [GET Find all Markers](#3-find-all-marker-get-markersprivateadmin)
    - [GET Find one Marker](#4-find-one-maker-get-markersprivateadminmarkerid)
    - [GET Count Markers](#5-count-marker-get-markersprivateadmincount)
    - [PATCH Update Marker](#6-update-marker-patch-markersprivateadminid)
    - [DELETE Delete Marker](#7-delete-marker-delete-markersprivateadminid)
    - [GET Find all Markers](#8-find-all-marker-get-markers)
    - [GET Find one Marker](#9-find-one-marker-get-markersmarkerid)
- [HTTP Response Status Codes](#http-response-status-codes)

---

# Introduce

This is the Geo-Map API documentation, which is built using **NestJS** and **MongoDB**.

The goal of this API is to handle geo-location data for places, zones, and markers, enabling easy creation, updating, and deletion of places and markers, as well as the ability to query them with specific filters.

# Getting Started

## Prerequisites

Ensure you have the following installed on your system:

- **[Node.js](https://nodejs.org/)** (LTS recommended)
- **[Yarn](https://yarnpkg.com/getting-started/install)**
- **[Docker](https://www.docker.com/)** (for containerization)

## Install the Application

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/liangkhwai/geo-map.git
   ```

2. Navigate into the project directory:
   ```bash
   cd geo-map
   ```
3. Install the project dependencies:

   ```bash
   yarn install
   ```

4. Rename the .env.example file to .env and configure the environment variables:

   ```bash
   mv .env.example .env
   ```

5. Start the Docker containers:

   ```bash
   docker-compose up -d
   ```

6. Start the application in development mode:

   ```bash
   yarn start:dev
   ```

## Places

The **Place** service is used to create places and zones for identifying markers.

## Schema

| Field Name         | Type     | Required | Default | Description                   |
| ------------------ | -------- | -------- | ------- | ----------------------------- |
| `placeId`          | `String` | ❌ No    | -       | รหัสเมือง เช่น "CT01"         |
| `municipalityName` | `String` | ✅ Yes   | -       | ชื่อหน่วยงาน เช่น "เทศบาลนคร" |
| `provinceName`     | `String` | ✅ Yes   | -       | ชื่อจังหวัด                   |
| `amphurName`       | `String` | ✅ Yes   | -       | ชื่ออำเภอ                     |
| `tambolName`       | `String` | ✅ Yes   | -       | ชื่อตำบล                      |
| `postCode`         | `String` | ✅ Yes   | -       | รหัสไปรษณีย์                  |
| `place`            | `String` | ✅ Yes   | -       | ข้อมูล geojson ของเมือง       |
| `zones`            | `String` | ✅ Yes   | -       | ข้อมูล geojson ของชุมชน       |

## Endpoint

### 1. Create Place `POST places/`

### Request Form-Data

| Key Form data      | Type     | Required | Default | Description                      |
| ------------------ | -------- | -------- | ------- | -------------------------------- |
| `placeId`          | `String` | ❌ No    | -       | The ID of the place.             |
| `municipalityName` | `String` | ✅ Yes   | -       | The community name of the place. |
| `provinceName`     | `String` | ✅ Yes   | -       | The province name of the place.  |
| `amphurName`       | `String` | ✅ Yes   | -       | The amphur name of the place.    |
| `tambolName`       | `String` | ✅ Yes   | -       | The tambol name of the place.    |
| `postCode`         | `String` | ✅ Yes   | -       | The post code of the place.      |
| `place`            | `File`   | ✅ Yes   | -       | The file .kmz for place.         |
| `zone`             | `File`   | ✅ Yes   | -       | The file .kmz for zone.          |

### Response

<details>
<summary>
Example Response
</summary>

```json
{
  "_id": "65d2a7f0b2d123456789abcd",
  "createdAt": "2025-02-01T16:30:32.448Z",
  "updatedAt": "2025-02-02T08:00:56.052Z",
  "placeId": "CT01",
  "municipalityName": "Bangkok",
  "provinceName": "Bangkok",
  "amphurName": "Pathum Wan",
  "tambolName": "Lumphini",
  "postCode": "10330",
  "location": {
    "lat": 13.736717,
    "lng": 100.523186
  },
  "place": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [100.5, 13.7],
              [100.6, 13.7],
              [100.6, 13.8],
              [100.5, 13.8],
              [100.5, 13.7]
            ]
          ]
        },
        "properties": {}
      }
    ]
  },
  "zones": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [100.55, 13.72],
              [100.58, 13.72],
              [100.58, 13.75],
              [100.55, 13.75],
              [100.55, 13.72]
            ]
          ]
        },
        "properties": {}
      }
    ]
  }
}
```

</details>

### 2. Find all Place `GET /places?[placeId]&[zoneId]`

### Request query

| Parameter | Type       | Required | Default | Description          |
| --------- | ---------- | -------- | ------- | -------------------- |
| `placeId` | `ObjectId` | ❌ No    | -       | The ID of the place. |
| `zoneId`  | `ObjectId` | ❌ No    | -       | The ID of the zone.  |

### Response

<details>
<summary>
Example Response 
</summary>

```json
{
  "data": {
    "_id": "65d2a7f0b2d123456789abcd",
    "municipalityName": "Bangkok",
    "provinceName": "Bangkok",
    "amphurName": "Pathum Wan",
    "tambolName": "Lumphini",
    "postCode": "10330",
    "location": {
      "lat": 13.736717,
      "lng": 100.523186
    },
    "place": {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [100.5, 13.7],
                [100.6, 13.7],
                [100.6, 13.8],
                [100.5, 13.8],
                [100.5, 13.7]
              ]
            ]
          },
          "properties": {}
        }
      ]
    },
    "zones": {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [100.55, 13.72],
                [100.58, 13.72],
                [100.58, 13.75],
                [100.55, 13.75],
                [100.55, 13.72]
              ]
            ]
          },
          "properties": {}
        }
      ]
    }
  },
  "markerCount": 1
}
```

</details>

### 3. Find one Place `GET places/{id}`

### Request

| Parameter | Type       | Required | Default | Description          |
| --------- | ---------- | -------- | ------- | -------------------- |
| `id`      | `ObjectId` | ✅ Yes   | -       | The ID of the place. |

### Response

<details>
<summary>
Example Response 
</summary>

```json
{
  "data": {
    "_id": "65d2a7f0b2d123456789abcd",
    "municipalityName": "Bangkok",
    "provinceName": "Bangkok",
    "amphurName": "Pathum Wan",
    "tambolName": "Lumphini",
    "postCode": "10330",
    "location": {
      "lat": 13.736717,
      "lng": 100.523186
    },
    "place": {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [100.5, 13.7],
                [100.6, 13.7],
                [100.6, 13.8],
                [100.5, 13.8],
                [100.5, 13.7]
              ]
            ]
          },
          "properties": {}
        }
      ]
    },
    "zones": {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [100.55, 13.72],
                [100.58, 13.72],
                [100.58, 13.75],
                [100.55, 13.75],
                [100.55, 13.72]
              ]
            ]
          },
          "properties": {}
        }
      ]
    }
  }
}
```

</details>

### 4. Find all Place Name `GET places/city`

### Response

#### Example 1

```json
[
  {
    "id": "679e4c28ff9896ba99438a68",
    "name": "เทศบาลเมืองตาคลี"
  }
]
```

### 5. Find all Place Name `GET places/zone`

### Response

#### Example 1

```json
[
  {
    "id": "679e4c28ff9896ba99438a6a",
    "name": "ชุมชนสามล"
  }
]
```


### 6. Upadte place `PATCH places/{id}`

### Request

#### Request Params

| Parameter | Type       | Required | Default | Description          |
| --------- | ---------- | -------- | ------- | -------------------- |
| `id`      | `ObjectId` | ✅ Yes   | -       | The ID of the place. |

#### Request Body

| Field Name         | Type     | Required | Default | Description                      |
| ------------------ | -------- | -------- | ------- | -------------------------------- |
| `placeId`          | `String` | ❌ No    | -       | The ID of the place.             |
| `municipalityName` | `String` | ❌ No    | -       | The community name of the place. |
| `provinceName`     | `String` | ❌ No    | -       | The province name of the place.  |
| `amphurName`       | `String` | ❌ No    | -       | The amphur name of the place.    |
| `tambolName`       | `String` | ❌ No    | -       | The tambol name of the place.    |
| `postCode`         | `String` | ❌ No    | -       | The post code of the place.      |

### Response

<details>
<summary>
Example Response
</summary>

```json
{
  "_id": "679e4c28ff9896ba99438a68",
  "createdAt": "2025-02-01T16:30:32.448Z",
  "updatedAt": "2025-02-02T08:00:56.052Z",
  "placeId": "CT01",
  "municipalityName": "เทศบาลเมืองตาคลี",
  "provinceName": "นครสวรรค์",
  "amphurName": "ตาคลี",
  "tambolName": "ตาคลี",
  "postCode": "60140",
  "location": {
    "type": "Point",
    "coordinates": [100.3561, 15.2336]
  },
  "place": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [100.5, 13.7],
              [100.6, 13.7],
              [100.6, 13.8],
              [100.5, 13.8],
              [100.5, 13.7]
            ]
          ]
        },
        "properties": {}
      }
    ]
  },
  "zones": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [100.55, 13.72],
              [100.58, 13.72],
              [100.58, 13.75],
              [100.55, 13.75],
              [100.55, 13.72]
            ]
          ]
        },
        "properties": {}
      }
    ]
  }
}
```

</details>

### 7. Delete place `DELETE places/{id}`

### Request

| Parameter | Type       | Required | Default | Description          |
| --------- | ---------- | -------- | ------- | -------------------- |
| `id`      | `ObjectId` | ✅ Yes   | -       | The ID of the place. |

### Response

```json
{
    "Place deleted successfully"
}
```

## Markers

The **Markers** service is responsible for creating, updating, retrieving, and deleting marker information. It manages markers within specified places and zones.

## Schema

| Schema         | Field       | Type               | Required | Description                                                                                   |
| -------------- | ----------- | ------------------ | -------- | --------------------------------------------------------------------------------------------- |
| **Places**     | placeId     | string             | ✅ Yes   | รหัสเมือง                                                                                     |
|                | zoneId      | string             | ✅ Yes   | รหัสชุมชน                                                                                     |
| **ImagePath**  | url         | string             | ✅ Yes   | URL ของรูปภาพ                                                                                 |
| **Socials**    | link        | string             | ✅ Yes   | URL ของโปรไฟล์โซเชียลมีเดีย                                                                   |
|                | label       | string             | ✅ Yes   | ป้ายกำกับสำหรับโซเชียลมีเดีย (เช่น Facebook, Instagram)                                       |
| **OTOP**       | name        | string             | ✅ Yes   | ชื่อสินค้า OTOP                                                                               |
|                | description | string             | ❌ No    | รายละเอียดของสินค้า OTOP                                                                      |
|                | openDaily   | string             | ❌ No    | เวลาทำการประจำวัน                                                                             |
|                | telNumber   | string             | ❌ No    | หมายเลขโทรศัพท์สำหรับติดต่อสอบถาม                                                             |
|                | imagePath   | Array of ImagePath | ❌ No    | อาร์เรย์ของรูปภาพ (subdocuments) ที่เกี่ยวข้องกับสินค้า                                       |
|                | price       | number             | ❌ No    | ราคาของสินค้า                                                                                 |
|                | socials     | Array of Socials   | ❌ No    | อาร์เรย์ของลิงก์โซเชียลมีเดีย (subdocuments) สำหรับสินค้า                                     |
| **Person**     | title       | string             | ❌ No    | คำนำหน้าชื่อ (เช่น นาย, นาง ฯลฯ)                                                              |
|                | firstName   | string             | ✅ Yes   | ชื่อ                                                                                          |
|                | lastName    | string             | ✅ Yes   | นามสกุล                                                                                       |
|                | placeName   | string             | ✅ Yes   | ชื่อเมือง                                                                                     |
|                | zoneName    | string             | ✅ Yes   | ชื่อชุมชน                                                                                     |
|                | idCard      | string             | ❌ No    | หมายเลขบัตรประจำตัวประชาชน                                                                    |
|                | gender      | string             | ❌ No    | เพศ                                                                                           |
|                | telNumber   | string             | ❌ No    | หมายเลขโทรศัพท์                                                                               |
|                | birthdate   | string             | ❌ No    | วันเกิดในรูปแบบ ISO (YYYY-MM-DD)                                                              |
|                | age         | number             | ❌ No    | อายุ                                                                                          |
| **Properties** | name        | string             | ✅ Yes   | ชื่อของเครื่องหมายหรือฟีเจอร์                                                                 |
|                | markerType  | string             | ✅ Yes   | ประเภท/หมวดหมู่ของเครื่องหมาย (เช่น "OTOP", "ผู้สูงอายุ")                                     |
|                | users       | Person             | ✅ Yes   | ข้อมูลผู้ใช้ตามที่ระบุในสคีมาของบุคคล                                                         |
|                | otop        | OTOP               | ❌ No    | รายละเอียดสินค้า OTOP (ถ้ามี)                                                                 |
|                | places      | Places             | ✅ Yes   | ข้อมูลสถานที่ตามที่ระบุในสคีมาของสถานที่                                                      |
| **geometry**   | type        | string             | ✅ Yes   | ประเภทของ GeoJSON                                                                             |
|                | coordinates | Array              | ✅ Yes   | อาร์เรย์ของพิกัด [longitude, latitude]                                                        |
| **Markers**    | geometry    | Point (GeoJSON)    | ✅ Yes   | วัตถุ GeoJSON ที่มี `type: "Point"` และอาร์เรย์ของพิกัด [longitude, latitude]                 |
|                | properties  | Properties         | ✅ Yes   | อ็อบเจ็กต์ซ้อนที่มีรายละเอียดของเครื่องหมาย (รวมถึงข้อมูลผู้ใช้, สถานที่ และถ้ามีข้อมูล OTOP) |
|                | createdAt   | Date               | ✅ Yes   | เวลาที่เอกสารถูกสร้าง                                                                         |
|                | updatedAt   | Date               | ✅ Yes   | เวลาที่เอกสารถูกอัปเดตล่าสุด                                                                  |
|                | deletedAt   | Date or null       | ❌ No    | เวลาที่เอกสารถูกลบ (แบบ soft delete) หรือ null หากยังไม่ถูกลบ                                 |

## Endpoint

### 1. Create Marker `POST /markers`

### Request

### Request Body

| Parameter                       | Type       | Required | Default | Description                                                 |
| ------------------------------- | ---------- | -------- | ------- | ----------------------------------------------------------- |
| `geometry`                      | `Object`   | ✅ Yes   | -       | อ็อบเจ็กต์ geometry ที่ประกอบด้วย `type` และ `coordinates`  |
| `geometry.type`                 | `string`   | ✅ Yes   | -       | ประเภทของ geometry (เช่น `"Point"`)                         |
| `geometry.coordinates`          | `Array`    | ✅ Yes   | -       | อาร์เรย์ของพิกัด `[longitude, latitude]`                    |
| `properties`                    | `Object`   | ✅ Yes   | -       | คุณสมบัติของฟีเจอร์                                         |
| `properties.name`               | `string`   | ✅ Yes   | -       | ชื่อของฟีเจอร์                                              |
| `properties.markerType`         | `string`   | ✅ Yes   | -       | ประเภทของ marker (เช่น `"OTOP"`, `"restaurant"`, เป็นต้น)   |
| `properties.users`              | `Object`   | ✅ Yes   | -       | ข้อมูลผู้ใช้ที่เกี่ยวข้องกับฟีเจอร์                         |
| `properties.users.firstName`    | `string`   | ✅ Yes   | -       | ชื่อของผู้ใช้                                               |
| `properties.users.lastName`     | `string`   | ✅ Yes   | -       | นามสกุลของผู้ใช้                                            |
| `properties.users.placeName`    | `string`   | ✅ Yes   | -       | ชื่อสถานที่ของผู้ใช้                                        |
| `properties.users.zoneName`     | `string`   | ✅ Yes   | -       | ชื่อโซนของผู้ใช้                                            |
| `properties.users.gender`       | `string`   | ❌ No    | -       | เพศของผู้ใช้                                                |
| `properties.users.idCard`       | `string`   | ❌ No    | -       | หมายเลขบัตรประจำตัวประชาชนของผู้ใช้                         |
| `properties.users.telNumber`    | `string`   | ❌ No    | -       | หมายเลขโทรศัพท์ของผู้ใช้                                    |
| `properties.users.birthdate`    | `string`   | ❌ No    | -       | วันเกิดของผู้ใช้ (ในรูปแบบ ISO)                             |
| `properties.users.age`          | `number`   | ❌ No    | -       | อายุของผู้ใช้                                               |
| `properties.otop`               | `Object`   | ❌ No    | -       | รายละเอียดของ OTOP                                          |
| `properties.otop.name`          | `string`   | ❌ No    | -       | ชื่อของ OTOP                                                |
| `properties.otop.description`   | `string`   | ❌ No    | -       | รายละเอียดของ OTOP                                          |
| `properties.otop.openDaily`     | `string`   | ❌ No    | -       | เวลาทำการของ OTOP                                           |
| `properties.otop.telNumber`     | `string`   | ❌ No    | -       | หมายเลขติดต่อของ OTOP                                       |
| `properties.otop.imagePath`     | `Array`    | ❌ No    | -       | รายการรูปภาพที่เกี่ยวข้องกับ OTOP                           |
| `properties.otop.imagePath.url` | `string`   | ❌ No    | -       | URL ของรูปภาพ                                               |
| `properties.otop.price`         | `number`   | ❌ No    | -       | ราคาของสินค้าภายใน OTOP                                     |
| `properties.otop.socials`       | `Array`    | ❌ No    | -       | รายการลิงก์โซเชียลมีเดียที่เกี่ยวข้องกับ OTOP               |
| `properties.otop.socials.link`  | `string`   | ❌ No    | -       | URL ของโปรไฟล์โซเชียลมีเดีย                                 |
| `properties.otop.socials.label` | `string`   | ❌ No    | -       | ป้ายสำหรับลิงก์โซเชียลมีเดีย (เช่น "Facebook", "Instagram") |
| `properties.places`             | `Object`   | ✅ Yes   | -       | ข้อมูลเมืองและชุมชน                                         |
| `properties.places.placeId`     | `ObjectId` | ✅ Yes   | -       | รหัสของเมือง                                                |
| `properties.places.zoneId`      | `ObjectId` | ✅ Yes   | -       | รหัสของชุมชน                                                |

<details>
<summary>Example request with otop</summary>

```json
{
  "geometry": {
    "type": "Point",
    "coordinates": [100.523186, 13.736717]
  },
  "properties": {
    "name": "ของดีขอนแก่น",
    "markerType": "OTOP",
    "users": {
      "firstName": "John",
      "lastName": "Doe",
      "placeName": "New York",
      "zoneName": "Manhattan",
      "gender": "Male",
      "telNumber": "+123456789",
      "birthdate": "1990-01-01",
      "age": 34
    },
    "otop": {
      "name": "Handmade Wooden Crafts",
      "description": "A variety of handmade wooden items, including toys and furniture.",
      "openDaily": "9:00 AM - 6:00 PM",
      "telNumber": "+987654321",
      "price": 100,
      "socials": [
        {
          "link": "https://facebook.com/handmadewooden",
          "label": "Facebook"
        },
        {
          "link": "https://instagram.com/handmadewooden",
          "label": "Instagram"
        }
      ]
    },
    "places": {
      "placeId": "679e4c28ff9896ba99438a68",
      "zoneId": "679e4c28ff9896ba99438a68"
    }
  }
}
```

</details>

<details>
<summary>Example request only user</summary>

```json
{
  "geometry": {
    "type": "Point",
    "coordinates": [100.523186, 15.2336]
  },
  "properties": {
    "name": "ชื่อหมุด",
    "markerType": "ผู้สูงอายุ",
    "users": {
      "firstName": "John",
      "lastName": "Doe",
      "placeName": "New York",
      "zoneName": "Manhattan",
      "gender": "Male",
      "idCard": "1212312121",
      "telNumber": "+123456789",
      "birthdate": "1990-01-01",
      "age": 34
    },
    "places": {
      "placeId": "679e4c28ff9896ba99438a68",
      "zoneId": "679e4c28ff9896ba99438a6a"
    }
  }
}
```

</details>

### Response

<details>
<summary>Example response only user</summary>

```json
{
  "geometry": { "type": "Point", "coordinates": [100.523186, 15.2336] },
  "properties": {
    "name": "ชื่อหมุด",
    "markerType": "ผู้สูงอายุ",
    "users": {
      "firstName": "John",
      "lastName": "Doe",
      "placeName": "New York",
      "zoneName": "Manhattan",
      "idCard": "1212312121",
      "gender": "Male",
      "telNumber": "+123456789",
      "birthdate": "1990-01-01",
      "age": 34,
      "_id": "679f42e684b74061a57d3e46"
    },
    "places": {
      "placeId": "679e4c28ff9896ba99438a68",
      "zoneId": "679e4c28ff9896ba99438a6a"
    }
  },
  "deletedAt": null,
  "_id": "679f42e684b74061a57d3e45",
  "createdAt": "2025-02-02T10:03:18.275Z",
  "updatedAt": "2025-02-02T10:03:18.275Z",
  "__v": 0
}
```

</details>

## Admin

### 2. Find all Marker [Pagination] `GET markers/private/admin/data?[placeId]&[zoneId]&[markerType]&[page]&[itemsPerPage]`

### Request query

| Parameter      | Type       | Required | Default | Description                     |
| -------------- | ---------- | -------- | ------- | ------------------------------- |
| `placeId`      | `ObjectId` | ✅ Yes   | -       | รหัสของเมือง                    |
| `zoneId`       | `ObjectId` | ❌ No    | -       | รหัสของชุมชน                    |
| `markerType`   | `string`   | ❌ No    | -       | ประเภทของหมุด                   |
| `page`         | `string`   | ❌ No    | `1`     | หมายเลขหน้าที่ต้องการแสดงผล     |
| `itemsPerPage` | `string`   | ❌ No    | `10`    | จำนวนรายการที่จะแสดงในแต่ละหน้า |

### Response

#### Example Response 1 with otop

<details>
<summary>
Example Response with otop
</summary>

```json
{
  "data": [
    {
      "_id": "679f1435a003d47f69ecce473",
      "geometry": {
        "type": "Point",
        "coordinates": [100.523186, 13.736717]
      },
      "properties": {
        "name": "Mock Location",
        "markerType": "generic",
        "users": {
          "firstName": "John",
          "lastName": "Doe",
          "placeName": "Mock City",
          "zoneName": "Downtown",
          "gender": "Male",
          "telNumber": "+123456789",
          "birthdate": "1990-01-01",
          "age": 34,
          "_id": "679f1435a003d47f69ecce48"
        },
        "otop": {
          "name": "Mock Otop Product",
          "description": "A variety of mock items, including furniture and decor.",
          "openDaily": "9:00 AM - 6:00 PM",
          "telNumber": "+987654321",
          "imagePath": [
            { "url": "mock_image_1", "_id": "679f1435a003d47f69ecce47" },
            { "url": "mock_image_2", "_id": "679f1435a003d47f69ecce48" }
          ],
          "price": 100,
          "socials": [
            {
              "link": "https://facebook.com/mockproduct",
              "label": "Facebook",
              "_id": "679f1435a003d47f69ecce47"
            },
            {
              "link": "https://instagram.com/mockproduct",
              "label": "Instagram",
              "_id": "679f1435a003d47f69ecce49"
            }
          ]
        },
        "places": {
          "placeId": "679f1435a003d47f69ecce47",
          "zoneId": "679f1435a003d47f69ecce47"
        }
      },
      "deletedAt": null,
      "createdAt": "2025-02-02T06:44:05.910Z",
      "updatedAt": "2025-02-02T06:44:05.910Z",
      "__v": 0
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "itemsPerPage": 10,
    "totalPages": 1
  }
}
```

</details>

<details>
<summary>Example Response only user</summary>

```json
{
  "data": [
    {
      "_id": "679f1435a003d47f69ecce49",
      "geometry": {
        "type": "Point",
        "coordinates": [100.523186, 15.2347]
      },
      "properties": {
        "name": "Sample Location",
        "markerType": "Senior",
        "users": {
          "firstName": "Jane",
          "lastName": "Smith",
          "placeName": "Sample City",
          "zoneName": "Sample Zone",
          "idCard": "0987654321",
          "gender": "Female",
          "telNumber": "+987654322",
          "birthdate": "1988-07-20",
          "age": 37,
          "_id": "679f1435a003d47f69ecce49"
        },
        "places": {
          "placeId": "679f1435a003d47f69ecce49",
          "zoneId": "679f1435a003d47f69ecce49"
        }
      },
      "deletedAt": null,
      "createdAt": "2025-02-02T07:25:31.184Z",
      "updatedAt": "2025-02-02T07:25:31.184Z",
      "__v": 0
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "itemsPerPage": 10,
    "totalPages": 1
  }
}
```

</details>

### 3. Find all Marker `GET markers/private/admin?[placeId]&[zoneId]&[markerType]`

### Request query

| Parameter    | Type       | Required | Default | Description   |
| ------------ | ---------- | -------- | ------- | ------------- |
| `placeId`    | `ObjectId` | ✅ Yes   | -       | รหัสเมือง     |
| `zoneId`     | `ObjectId` | ❌ No    | -       | รหัสชุมชน     |
| `markerType` | `string`   | ❌ No    | -       | ประเภทของหมุด |

### Response

<details>
<summary>Example response</summary>

```json
[
  {
    "_id": "679f1435a003d47f69ecce49",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [100.523186, 15.2336]
    },
    "properties": {
      "name": "Example Location",
      "markerType": "Elderly",
      "users": {
        "firstName": "John",
        "lastName": "Doe",
        "placeName": "Mock City",
        "zoneName": "Mock Zone",
        "idCard": "1234567890",
        "gender": "Male",
        "telNumber": "+987654321",
        "birthdate": "1985-05-15",
        "age": 40,
        "_id": "679f1435a003d47f69ecce49"
      },
      "places": {
        "placeId": "679f1435a003d47f69ecce49",
        "zoneId": "679f1435a003d47f69ecce49"
      }
    },
    "createdAt": "2025-02-02T14:19:31.184+07:00",
    "updatedAt": "2025-02-02T14:19:31.184+07:00",
    "deletedAt": null
  },
  {
    "_id": "679f1435a003d47f69ecce49",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [100.523186, 13.736717]
    },
    "properties": {
      "name": "Sample OTOP Location",
      "markerType": "OTOP",
      "users": {
        "firstName": "Jane",
        "lastName": "Smith",
        "placeName": "Sample City",
        "zoneName": "Sample Zone",
        "gender": "Female",
        "telNumber": "+987654322",
        "birthdate": "1988-07-20",
        "age": 37,
        "_id": "679f1435a003d47f69ecce49"
      },
      "otop": {
        "name": "Handmade Crafts",
        "description": "Various handmade items, including furniture and decor.",
        "openDaily": "9:00 AM - 6:00 PM",
        "telNumber": "+987654323",
        "imagePath": [
          { "url": "WOODEN_ITEM_1", "_id": "679f1435a003d47f69ecce49" },
          { "url": "WOODEN_ITEM_2", "_id": "679f1435a003d47f69ecce49" }
        ],
        "price": 150,
        "socials": [
          {
            "link": "https://facebook.com/samplecrafts",
            "label": "Facebook",
            "_id": "679f1435a003d47f69ecce49"
          },
          {
            "link": "https://instagram.com/samplecrafts",
            "label": "Instagram",
            "_id": "679f1435a003d47f69ecce49"
          }
        ]
      },
      "places": {
        "placeId": "679f1435a003d47f69ecce49",
        "zoneId": "679f1435a003d47f69ecce49"
      }
    },
    "createdAt": "2025-02-02T14:40:43.713+07:00",
    "updatedAt": "2025-02-02T14:40:43.713+07:00",
    "deletedAt": null
  }
]
```

</details>

### 4. Find one Maker `GET markers/private/admin/:markerId`

### Request param

| Parameter  | Type       | Required | Default | Description |
| ---------- | ---------- | -------- | ------- | ----------- |
| `markerId` | `ObjectId` | ✅ Yes   | -       | รหัสของหมุด |

### Response

<details>
<summary>
Example response only user
</summary>

```json
[
  {
    "_id": "679f1c83a003d47f69ecce50",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [100.523186, 15.2336]
    },
    "properties": {
      "name": "TEST",
      "markerType": "ผู้สูงอายุ",
      "users": {
        "firstName": "John",
        "lastName": "Doe",
        "placeName": "New York",
        "zoneName": "Manhattan",
        "idCard": "1212312121",
        "gender": "Male",
        "telNumber": "+123456789",
        "birthdate": "1990-01-01",
        "age": 34,
        "_id": "679f1c83a003d47f69ecce51"
      },
      "places": {
        "placeId": "679e4c28ff9896ba99438a68",
        "zoneId": "679e4c28ff9896ba99438a6a"
      }
    },
    "createdAt": "2025-02-02T14:19:31.184+07:00",
    "updatedAt": "2025-02-02T14:19:31.184+07:00",
    "deletedAt": null
  }
]
```

</details>

<details>
<summary>
Example response with otop
</summary>

```json
[
  {
    "_id": "679f2122a003d47f69ecce5f",
    "type": "Feature",
    "geometry": { "type": "Point", "coordinates": [100.523186, 13.736717] },
    "properties": {
      "name": "TEST OTOP",
      "markerType": "OTOP",
      "users": {
        "firstName": "John",
        "lastName": "Doe",
        "placeName": "New York",
        "zoneName": "Manhattan",
        "gender": "Male",
        "telNumber": "+123456789",
        "birthdate": "1990-01-01",
        "age": 34,
        "_id": "679f2122a003d47f69ecce60"
      },
      "otop": {
        "name": "Handmade Wooden Crafts",
        "description": "A variety of handmade wooden items, including toys and furniture.",
        "openDaily": "9:00 AM - 6:00 PM",
        "telNumber": "+987654321",
        "imagePath": [
          { "url": "WOODEN_ITEM_1", "_id": "679f2122a003d47f69ecce61" },
          { "url": "WOODEN_ITEM_2", "_id": "679f2122a003d47f69ecce62" }
        ],
        "price": 100,
        "socials": [
          {
            "link": "https://facebook.com/handmadewooden",
            "label": "Facebook",
            "_id": "679f2122a003d47f69ecce63"
          },
          {
            "link": "https://instagram.com/handmadewooden",
            "label": "Instagram",
            "_id": "679f2122a003d47f69ecce64"
          }
        ]
      },
      "places": {
        "placeId": "679f2122a003d47f69ecce61",
        "zoneId": "679f2122a003d47f69ecce61"
      }
    },
    "createdAt": "2025-02-02T14:39:14.345+07:00",
    "updatedAt": "2025-02-02T14:39:14.345+07:00",
    "deletedAt": null
  }
]
```

</details>

### 5. Count marker `GET /markers/private/admin/count?[placeId]&[zoneId]&[markerType]`

### Request query

| Parameter    | Type       | Required | Default | Description   |
| ------------ | ---------- | -------- | ------- | ------------- |
| `placeId`    | `ObjectId` | ✅ Yes   | -       | รหัสเมือง     |
| `zoneId`     | `ObjectId` | ❌ No    | -       | รหัสชุมชน     |
| `markerType` | `string`   | ❌ No    | -       | ประเภทของหมุด |

### Response

#### Example response 1 [no marker]

```json
0
```

#### Example response 2

```json
3
```

### 6. Update Marker `PATCH /markers/private/admin/:id`

### Request

#### Request Param

| Parameter | Type       | Required | Default | Description |
| --------- | ---------- | -------- | ------- | ----------- |
| `id`      | `ObjectId` | ✅ Yes   | -       | รหัสของหมุด |

#### Request Body

| Parameter                       | Type       | Required | Default | Description                                                        |
| ------------------------------- | ---------- | -------- | ------- | ------------------------------------------------------------------ |
| `geometry`                      | `Object`   | ❌ No    | -       | ข้อมูล object ที่เก็บรายละเอียดเกี่ยวกับประเภทและพิกัดของ geometry |
| `geometry.type`                 | `string`   | ❌ No    | -       | ประเภทของ geometry เช่น `Point`                                    |
| `geometry.coordinates`          | `array`    | ❌ No    | -       | พิกัดของจุด `[longitude, latitude]`                                |
| `properties`                    | `Object`   | ❌ No    | -       | ข้อมูล object ที่เก็บรายละเอียดเกี่ยวกับ OTOP                      |
| `properties.name`               | `string`   | ❌ No    | -       | ชื่อของ OTOP                                                       |
| `properties.markerType`         | `string`   | ❌ No    | -       | ประเภทของ marker (เช่น ร้านอาหาร)                                  |
| `properties.users`              | `Object`   | ❌ No    | -       | ข้อมูลผู้ใช้ที่เกี่ยวข้องกับ OTOP                                  |
| `properties.users.firstName`    | `string`   | ❌ No    | -       | ชื่อของผู้ใช้                                                      |
| `properties.users.lastName`     | `string`   | ❌ No    | -       | นามสกุลของผู้ใช้                                                   |
| `properties.users.placeName`    | `string`   | ❌ No    | -       | ชื่อเมืองที่ผู้ใช้อาศัยอยู่                                        |
| `properties.users.zoneName`     | `string`   | ❌ No    | -       | ชื่อชุมชนที่ผู้ใช้อาศัยอยู่                                        |
| `properties.otop`               | `Object`   | ❌ No    | -       | ข้อมูลเกี่ยวกับสินค้า OTOP                                         |
| `properties.otop.name`          | `string`   | ❌ No    | -       | ชื่อของสินค้า OTOP                                                 |
| `properties.otop.description`   | `string`   | ❌ No    | -       | รายละเอียดของสินค้า OTOP                                           |
| `properties.otop.openDaily`     | `string`   | ❌ No    | -       | เวลาเปิด-ปิดของ OTOP                                               |
| `properties.otop.telNumber`     | `string`   | ❌ No    | -       | เบอร์โทรศัพท์ของ OTOP                                              |
| `properties.otop.imagePath`     | `array`    | ❌ No    | -       | รายการรูปภาพที่เกี่ยวข้องกับ OTOP                                  |
| `properties.otop.imagePath.url` | `string`   | ❌ No    | -       | URL ของรูปภาพที่เกี่ยวข้องกับ OTOP                                 |
| `properties.otop.price`         | `number`   | ❌ No    | -       | ราคาของสินค้า OTOP                                                 |
| `properties.otop.socials`       | `array`    | ❌ No    | -       | รายการลิงก์โซเชียลมีเดียของ OTOP                                   |
| `properties.otop.socials.link`  | `string`   | ❌ No    | -       | URL ของโปรไฟล์โซเชียลมีเดียของ OTOP                                |
| `properties.otop.socials.label` | `string`   | ❌ No    | -       | ป้ายกำกับของแพลตฟอร์มโซเชียลมีเดีย                                 |
| `properties.places`             | `Object`   | ❌ No    | -       | ข้อมูลเกี่ยวกับเมืองและชุมชน                                       |
| `properties.places.placeId`     | `ObjectId` | ❌ No    | -       | รหัสเมือง                                                          |
| `properties.places.zoneId`      | `ObjectId` | ❌ No    | -       | รหัสชุมชน                                                          |

<details>
<summary>
Example Request body with otop
</summary>

```json
{
  "geometry": {
    "type": "Point",
    "coordinates": [100.523186, 13.736717]
  },
  "properties": {
    "name": "TEST OTOP",
    "markerType": "restaurant",
    "users": {
      "firstName": "John",
      "lastName": "Doe",
      "placeName": "New York"
    },
    "otop": {
      "name": "GEGE",
      "description": "A variety of handmade wooden items, including toys and furniture.",
      "openDaily": "9:00 AM - 6:00 PM",
      "telNumber": "+987654321",
      "price": 100,
      "socials": [
        {
          "link": "https://facebook.com/handmadewooden",
          "label": "Facebook"
        }
      ]
    },
    "places": {
      "placeId": "5f8d0d55b4e8a9c1d2c3c4e9",
      "zoneId": "5f8d0d55b4e8a9c1d2c3c4f0"
    }
  }
}
```

</details>

### Response

<details>
<summary>
Example Response with otop
</summary>

```json
{
  "geometry": { "type": "Point", "coordinates": [100.523186, 13.736717] },
  "_id": "679f217ba003d47f69ecce69",
  "properties": {
    "name": "THISEEE OTOP",
    "markerType": "OTOP",
    "users": {
      "firstName": "John",
      "lastName": "Doe",
      "placeName": "New York",
      "zoneName": "Manhattan",
      "gender": "Male",
      "telNumber": "+123456789",
      "birthdate": "1990-01-01",
      "age": 34,
      "_id": "679f217ba003d47f69ecce6a"
    },
    "otop": {
      "name": "Handmade Wooden Crafts",
      "description": "A variety of handmade wooden items, including toys and furniture.",
      "openDaily": "9:00 AM - 6:00 PM",
      "telNumber": "+987654321",
      "price": 100,
      "socials": [
        {
          "link": "https://facebook.com/handmadewooden",
          "label": "Facebook",
          "_id": "679f217ba003d47f69ecce6d"
        },
        {
          "link": "https://instagram.com/handmadewooden",
          "label": "Instagram",
          "_id": "679f217ba003d47f69ecce6e"
        }
      ]
    },
    "places": {
      "placeId": "679e4c28ff9896ba99438a68",
      "zoneId": "679e4c28ff9896ba99438a68"
    }
  },
  "deletedAt": null,
  "createdAt": "2025-02-02T07:40:43.713Z",
  "updatedAt": "2025-02-02T08:23:08.951Z",
  "__v": 0
}
```

</details>

### 7. Delete Marker `DELETE /markers/private/admin/:id`

### Request

#### Request Param

| Parameter | Type       | Required | Default | Description |
| --------- | ---------- | -------- | ------- | ----------- |
| `id`      | `ObjectId` | ✅ Yes   | -       | รหัสของหมุด |

### Response

#### Example response with otop

<details>
<summary>
Example Response with otop
</summary>

```json
{
  "geometry": {
    "type": "Point",
    "coordinates": [100.523186, 13.736717]
  },
  "_id": "679f217ba003d47f69ecce69",
  "properties": {
    "name": "ของดีเมืองขอนแก่น",
    "markerType": "OTOP",
    "users": {
      "firstName": "John",
      "lastName": "Doe",
      "placeName": "New York",
      "zoneName": "Manhattan",
      "gender": "Male",
      "telNumber": "+123456789",
      "birthdate": "1990-01-01",
      "age": 34,
      "_id": "679f217ba003d47f69ecce6a"
    },
    "otop": {
      "name": "Handmade Wooden Crafts",
      "description": "A variety of handmade wooden items, including toys and furniture.",
      "openDaily": "9:00 AM - 6:00 PM",
      "telNumber": "+987654321",
      "imagePath": [
        {
          "url": "WOODEN_ITEM_1",
          "_id": "679f217ba003d47f69ecce6b"
        },
        {
          "url": "WOODEN_ITEM_2",
          "_id": "679f217ba003d47f69ecce6c"
        }
      ],
      "price": 100,
      "socials": [
        {
          "link": "https://facebook.com/handmadewooden",
          "label": "Facebook",
          "_id": "679f217ba003d47f69ecce6d"
        },
        {
          "link": "https://instagram.com/handmadewooden",
          "label": "Instagram",
          "_id": "679f217ba003d47f69ecce6e"
        }
      ]
    },
    "places": {
      "placeId": "679e4c28ff9896ba99438a68",
      "zoneId": "679e4c28ff9896ba99438a68"
    }
  },
  "deletedAt": "2025-02-02T08:44:08.146Z",
  "createdAt": "2025-02-02T07:40:43.713Z",
  "updatedAt": "2025-02-02T08:44:08.147Z",
  "__v": 0
}
```

</details>

## Users

### 8. Find All Marker `GET /markers?[placeId]&[zoneId]&[markerType]`

### Request

#### Request Query

| Parameter    | Type       | Required | Default | Description |
| ------------ | ---------- | -------- | ------- | ----------- |
| `placeId`    | `ObjectId` | ✅ Yes   | -       | รหัสเมือง   |
| `zoneId`     | `ObjectId` | ❌ No    | -       | รหัสชุมชน   |
| `markerType` | `string`   | ❌ No    | -       | ประเภทหมุด  |

### Response

<details>
<summary>Example Response</summary>

```json
[
  {
    "_id": "679f1c83a003d47f69ecce50",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [100.523186, 15.2336]
    },
    "properties": {
      "markerType": "ผู้สูงอายุ",
      "places": {
        "placeId": "679e4c28ff9896ba99438a68",
        "zoneId": "679e4c28ff9896ba99438a6a"
      }
    },
    "createdAt": "2025-02-02T14:19:31.184+07:00",
    "updatedAt": "2025-02-02T14:19:31.184+07:00",
    "deletedAt": null
  },
  {
    "_id": "679f322fa003d47f69eccea6",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [100.523186, 15.2336]
    },
    "properties": {
      "markerType": "ผู้สูงอายุ",
      "places": {
        "placeId": "679e4c28ff9896ba99438a68",
        "zoneId": "679e4c28ff9896ba99438a6a"
      }
    },
    "createdAt": "2025-02-02T15:51:59.083+07:00",
    "updatedAt": "2025-02-02T15:51:59.083+07:00",
    "deletedAt": null
  }
]
```

</details>

### 9. Find One Marker `GET /markers/:markerId`

### Request

#### Request Param

| Parameter  | Type       | Required | Default | Description |
| ---------- | ---------- | -------- | ------- | ----------- |
| `markerId` | `ObjectId` | ✅ Yes   | -       | รหัสหมุด    |

### Response

<details>
<summary>Example Response</summary>

```json
[
  {
    "_id": "679f1c83a003d47f69ecce50",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [100.523186, 15.2336]
    },
    "properties": {
      "name": "TEST",
      "markerType": "ผู้สูงอายุ",
      "places": {
        "placeId": "679e4c28ff9896ba99438a68",
        "zoneId": "679e4c28ff9896ba99438a6a"
      }
    },
    "createdAt": "2025-02-02T14:19:31.184+07:00",
    "updatedAt": "2025-02-02T14:19:31.184+07:00",
    "deletedAt": null
  }
]
```

</details>

---

## HTTP Response Status Codes

รหัสสถานะ HTTP ที่ใช้ในการตอบกลับของ API Geo-Map มีดังนี้:

- **200 OK**: การร้องขอสำเร็จและเซิร์ฟเวอร์ส่งข้อมูลที่ร้องขอมา

  - ตัวอย่าง: ดึงข้อมูลสำเร็จ หรืออัปเดตทรัพยากรสำเร็จ

- **201 Created**: การร้องขอสำเร็จและมีการสร้างทรัพยากรใหม่

  - ตัวอย่าง: สร้าง Place หรือ Marker ใหม่สำเร็จ

- **204 No Content**: การร้องขอสำเร็จ แต่ไม่มีข้อมูลที่จะส่งกลับ

  - ตัวอย่าง: การลบหรืออัปเดตสำเร็จแต่ไม่มีข้อมูลส่งกลับ

- **400 Bad Request**: เซิร์ฟเวอร์ไม่สามารถเข้าใจคำขอเนื่องจากไวยากรณ์ที่ไม่ถูกต้องหรือข้อมูลที่ขาดหายไป

  - ตัวอย่าง: ขาดข้อมูลที่จำเป็นในคำขอ POST

- **401 Unauthorized**: การร้องขอต้องการการตรวจสอบสิทธิ์ผู้ใช้

  - ตัวอย่าง: ขาดหรือโทเค็นการยืนยันตัวตนไม่ถูกต้อง

- **403 Forbidden**: เซิร์ฟเวอร์เข้าใจคำขอแล้ว แต่ไม่อนุญาตให้ดำเนินการ

  - ตัวอย่าง: ผู้ใช้ไม่มีสิทธิ์เข้าถึงทรัพยากรนั้น

- **404 Not Found**: เซิร์ฟเวอร์ไม่พบทรัพยากรที่ร้องขอ

  - ตัวอย่าง: Place หรือ Marker ที่มี ID ที่ระบุไม่มีอยู่จริง

- **405 Method Not Allowed**: วิธีที่ระบุในคำขอไม่อนุญาตให้ใช้กับทรัพยากรนั้น

  - ตัวอย่าง: พยายามส่งคำขอ POST ไปยัง endpoint ที่เป็นแค่การอ่าน

- **409 Conflict**: การร้องขอไม่สามารถทำได้เนื่องจากมีความขัดแย้งกับสถานะปัจจุบันของทรัพยากร

  - ตัวอย่าง: พยายามสร้าง Place ที่มีชื่อซ้ำกับที่มีอยู่แล้ว

- **422 Unprocessable Entity**: การร้องขอถูกสร้างขึ้นอย่างถูกต้อง แต่เซิร์ฟเวอร์ไม่สามารถประมวลผลคำสั่งที่มีอยู่

  - ตัวอย่าง: ข้อมูลในคำขอไม่ถูกต้องตามรูปแบบที่เซิร์ฟเวอร์ต้องการ

- **500 Internal Server Error**: เซิร์ฟเวอร์เจอปัญหาที่ไม่คาดคิดและไม่สามารถทำคำขอให้สำเร็จได้

  - ตัวอย่าง: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ เช่น ปัญหาฐานข้อมูล

- **502 Bad Gateway**: เซิร์ฟเวอร์ทำหน้าที่เป็นเกตเวย์หรือพร็อกซี่ แต่ได้รับคำตอบที่ไม่ถูกต้องจากเซิร์ฟเวอร์ต้นทาง

  - ตัวอย่าง: บริการหรือฐานข้อมูลด้านล่างไม่สามารถเข้าถึงได้

- **503 Service Unavailable**: เซิร์ฟเวอร์ไม่สามารถดำเนินการคำขอได้เนื่องจากมีการทำงานเกินพิกัดหรือกำลังอยู่ในช่วงบำรุงรักษา
  - ตัวอย่าง: เซิร์ฟเวอร์ไม่สามารถใช้งานได้ชั่วคราวเนื่องจากการบำรุงรักษาหรือการโหลดที่สูง

---
