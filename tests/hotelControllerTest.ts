import express, { Express } from 'express';
import { createHotel } from './../src/controllers/hotelController';
import request from 'supertest';
// import app from './../src/app';
import path from 'path';
import fs from 'fs';
import { Hotel,Room } from './../src/models/Hotel';


//!unit testing of create api


// describe('POST /api/hotel', () => {
//   // Cleanup JSON files after tests
//   afterAll(() => {
//     const uploadDir = path.join(__dirname, '../../uploads');
//     fs.readdirSync(uploadDir).forEach(file => {
//       if (file.endsWith('.json')) fs.unlinkSync(path.join(uploadDir, file));
//     });
//   });

//   it('should create a hotel successfully with valid data and images', async () => {
//     const res = await request(app)
//       .post('/api/hotel')
//       .field('title', 'Sample Hotel')
//       .field('description', 'A sample description')
//       .field('guestCount', '4')
//       .field('bedroomCount', '2')
//       .field('bathroomCount', '2')
//       .field('amenities', 'WiFi,Pool,Air Conditioning')
//       .field('hostInfo', 'Host Information')
//       .field('address', '123 Main St')
//       .field('latitude', '40.7128')
//       .field('longitude', '-74.0060')
//       .field('rooms', JSON.stringify([{ roomTitle: 'Deluxe Room', bedroomCount: 1 }]))
//       .attach('images', path.resolve(__dirname, '../fixtures/hotelImage1.jpg'))
//       .attach('images', path.resolve(__dirname, '../fixtures/hotelImage2.jpg'))
//       .attach('roomImage', path.resolve(__dirname, '../fixtures/roomImage1.jpg'));

//     expect(res.statusCode).toEqual(201);
//     expect(res.body.message).toBe('Hotel created successfully');
//     expect(res.body.data).toMatchObject({
//       title: 'Sample Hotel',
//       description: 'A sample description',
//       guestCount: 4,
//       bedroomCount: 2,
//       bathroomCount: 2,
//       amenities: ['WiFi', 'Pool', 'Air Conditioning'],
//       address: '123 Main St',
//       latitude: 40.7128,
//       longitude: -74.0060,
//       images: expect.any(Array),
//       rooms: expect.any(Array),
//     });
//     expect(res.body.data.images.length).toBeGreaterThan(0);
//     expect(res.body.data.rooms.length).toBe(1);
//     expect(res.body.data.rooms[0].roomTitle).toBe('Deluxe Room');
//   });

//   it('should return a 400 error if required fields are missing', async () => {
//     const res = await request(app)
//       .post('/api/hotel')
//       .field('guestCount', '4')
//       .field('latitude', '40.7128')
//       .field('longitude', '-74.0060');

//     expect(res.statusCode).toEqual(400);
//     expect(res.body.error).toBe('Title and description are required');
//   });

//   it('should return a 500 error if file upload fails', async () => {
//     // Simulate a file upload failure by changing the upload destination to a non-existent path temporarily.
//     jest.mock('multer', () => () => ({
//       storage: {
//         diskStorage: jest.fn(() => ({
//           destination: (req: any, file: any, cb: any) => cb(new Error('File upload error'), ''),
//         })),
//       },
//     }));

//     const res = await request(app)
//       .post('/api/hotel')
//       .field('title', 'Sample Hotel')
//       .field('description', 'A sample description');

//     expect(res.statusCode).toEqual(500);
//     expect(res.body.error).toBe('Error uploading files');
//   });
// });




const app: Express = express();
app.use(express.json());
app.post('/api/hotel', createHotel);

// Mock file system operations
jest.mock('fs');

describe('POST /api/hotel', () => {
  const validHotelData = {
    title: 'Test Hotel',
    description: 'A beautiful place to stay',
    guestCount: 2,
    bedroomCount: 1,
    bathroomCount: 1,
    amenities: 'WiFi,Pool,Parking',
    hostInfo: 'John Doe',
    address: '123 Test St',
    latitude: 12.34,
    longitude: 56.78,
    rooms: JSON.stringify([{ roomTitle: 'Deluxe Room', bedroomCount: 1 }]),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a hotel successfully with valid data and images', async () => {
    // Mock the file write operation
    const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const response = await request(app)
      .post('/api/hotel')
      .field('title', validHotelData.title)
      .field('description', validHotelData.description)
      .field('guestCount', validHotelData.guestCount.toString())
      .field('bedroomCount', validHotelData.bedroomCount.toString())
      .field('bathroomCount', validHotelData.bathroomCount.toString())
      .field('amenities', validHotelData.amenities)
      .field('hostInfo', validHotelData.hostInfo)
      .field('address', validHotelData.address)
      .field('latitude', validHotelData.latitude.toString())
      .field('longitude', validHotelData.longitude.toString())
      .field('rooms', validHotelData.rooms)
      .attach('images', path.join(__dirname, 'fixtures/hotelImage1.jpg'))
      .attach('roomImage', path.join(__dirname, 'fixtures/roomImage1.jpg'));

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Hotel created successfully');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('slug');
    expect(response.body.data).toHaveProperty('images');
    expect(response.body.data.images).toHaveLength(1);
    expect(writeFileSyncMock).toHaveBeenCalled();
  });

  test('should return a 400 error if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/hotel')
      .field('description', validHotelData.description);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title and description are required');
  });

  test('should return a 500 error if file upload fails', async () => {
    // Simulate a file upload error by triggering an error in multer
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error('File upload error');
    });

    const response = await request(app)
      .post('/api/hotel')
      .field('title', validHotelData.title)
      .field('description', validHotelData.description)
      .attach('images', path.join(__dirname, 'fixtures/hotelImage1.jpg'));

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error uploading files');
  });
});





// describe('POST /hotel', () => {
//   it('should create a hotel', async () => {
//     const res = await request(app).post('/api/hotel').send({
//       title: 'Sample Hotel',
//       description: 'A beautiful place to stay',
//       guestCount: 4,
//       bedroomCount: 2,
//       bathroomCount: 1,
//       amenities: ['WiFi', 'Parking'],
//     });

//     expect(res.statusCode).toEqual(201);
//     expect(res.body.message).toBe('Hotel created');
//     expect(res.body.data.title).toBe('Sample Hotel');
//   });
// });


//!unit testing of get api
describe('GET /hotel/:hotelId', () => {
  it('should retrieve hotel details successfully', async () => {
    const hotelId = 'sample-hotel-id'; // Use an actual ID that exists in your setup

    const res = await request(app).get(`/api/hotel/${hotelId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Hotel details retrieved successfully');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('title');
  });

  it('should return 404 if hotel does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    const res = await request(app).get(`/api/hotel/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('There exists no hotel against this id');
  });
});




//!unit testing of get all hotels api


jest.mock('fs');

describe('GET /hotels', () => {
  const directoryPath = path.join(__dirname, '../../uploads');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve all hotels successfully', async () => {
    const mockHotels = [
      { id: 'hotel1', title: 'Hotel One', description: 'A nice hotel' },
      { id: 'hotel2', title: 'Hotel Two', description: 'Another nice hotel' },
    ];

    // Mock file system operations
    (fs.readdirSync as jest.Mock).mockReturnValue(['hotel1.json', 'hotel2.json']);
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(JSON.stringify(mockHotels[0]))
      .mockReturnValueOnce(JSON.stringify(mockHotels[1]));

    const res = await request(app).get('/api/hotels');

    expect(fs.readdirSync).toHaveBeenCalledWith(directoryPath);
    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Hotels retrieved successfully');
    expect(res.body.data).toEqual(mockHotels);
  });

  it('should return an empty list if no hotels are found', async () => {
    // Mock file system to return an empty directory
    (fs.readdirSync as jest.Mock).mockReturnValue([]);

    const res = await request(app).get('/api/hotels');

    expect(fs.readdirSync).toHaveBeenCalledWith(directoryPath);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Hotels retrieved successfully');
    expect(res.body.data).toEqual([]);
  });

  it('should handle errors when retrieving hotels', async () => {
    // Mock file system to throw an error
    (fs.readdirSync as jest.Mock).mockImplementation(() => {
      throw new Error('File system error');
    });

    const res = await request(app).get('/api/hotels');

    expect(fs.readdirSync).toHaveBeenCalledWith(directoryPath);
    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe('Error retrieving hotels');
  });
});


//!!unit testing of update api
describe('PUT /hotel/:hotelId', () => {
  it('should update hotel details successfully', async () => {
    const hotelId = 'sample-hotel-id'; // Use an actual ID that exists in your setup

    const res = await request(app).put(`/api/hotel/${hotelId}`).send({
      title: 'Updated Hotel Title',
      description: 'Updated description',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Hotel updated successfully');
    expect(res.body.data.title).toBe('Updated Hotel Title');
  });

  it('should return 404 if hotel does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    const res = await request(app).put(`/api/hotel/${nonExistentId}`).send({
      title: 'Another Title',
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('Hotel not found');
  });
});









// import fs from 'fs';
// import path from 'path';
// import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
 
// const hotelId = 'sample-hotel-id';
// const filePath = path.join(__dirname, `../../uploads/${hotelId}.json`);
 
// describe('PUT /hotel/:hotelId', () => {
//   beforeAll(() => {
//     // Create a sample hotel file before tests
//     const initialData = {
//       title: 'Original Hotel Title',
//       description: 'Original description',
//       guestCount: 3,
//       bedroomCount: 2,
//       bathroomCount: 1,
//       amenities: ['WiFi']
//     };
//     fs.writeFileSync(filePath, JSON.stringify(initialData));
//   });
 
//   afterAll(() => {
//     // Remove the sample hotel file after tests
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//   });
 
//   it('should update hotel details successfully', async () => {
//     const res = await request(app).put(`/api/hotel/${hotelId}`).send({
//       title: 'Updated Hotel Title',
//       description: 'Updated description',
//     });
 
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.message).toBe('Hotel updated successfully');
//     expect(res.body.data.title).toBe('Updated Hotel Title');
//   });
 
//   it('should return 404 if hotel does not exist', async () => {
//     const nonExistentId = 'non-existent-id';
 
//     const res = await request(app).put(`/api/hotel/${nonExistentId}`).send({
//       title: 'Another Title',
//     });
//     expect(res.statusCode).toEqual(404);
//     expect(res.body.error).toBe('Hotel not found');
//   });
// });




// import mockFs from 'jest-mock-fs';

// beforeAll(() => {
//   mockFs({
//     'uploads/sample-hotel-id.json': JSON.stringify({
//       title: 'Sample Hotel',
//       description: 'Sample Description',
//       slug: 'sample-hotel'
//     }),
//     'uploads/non-existent-id.json': ''  // mock for non-existent hotel
//   });
// });

// afterAll(() => {
//   mockFs.restore();
// });

// describe('PUT /hotel/:hotelId', () => {
//   it('should update hotel details successfully', async () => {
//     const hotelId = 'sample-hotel-id'; 

//     const res = await request(app).put(`/api/hotel/${hotelId}`).send({
//       title: 'Updated Hotel Title',
//       description: 'Updated description',
//     });

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.message).toBe('Hotel updated successfully');
//     expect(res.body.data.title).toBe('Updated Hotel Title');
//   });

//   it('should return 404 if hotel does not exist', async () => {
//     const nonExistentId = 'non-existent-id';

//     const res = await request(app).put(`/api/hotel/${nonExistentId}`).send({
//       title: 'Another Title',
//     });
//     expect(res.statusCode).toEqual(404);
//     expect(res.body.error).toBe('Hotel not found');
//   });
// });
