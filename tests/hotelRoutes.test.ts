// Your Express app
import request from 'supertest';
import app from './../src/app';  // Assuming your Express app is in 'app.ts'
import fs from 'fs';
import mockFs from 'mock-fs';
import slugify from 'slugify';
import multer from 'multer';
import path from 'path';

import { getHotel } from '../src/controllers/hotelController';
import { Request, Response } from 'express';

jest.mock('fs');

describe('POST /api/hotel', () => {
  it('should create a hotel successfully with valid data', async () => {
    const newHotelData = {
      title: 'Hotel Example',
      description: 'A luxurious hotel',
      guestCount: 4,
      bedroomCount: 2,
      bathroomCount: 2,
      amenities: 'Pool, Spa, Gym',
      hostInfo: 'John Doe',
      address: '123 Hotel Street',
      latitude: '40.712776',
      longitude: '-74.005974',
      images:[],
      rooms: JSON.stringify([
        {
          roomTitle: 'Deluxe Room',
          bedroomCount: 1,
        },
      ]),
    };

    const response = await request(app)
      .post('/api/hotel').send(newHotelData); 
      // .field('title', newHotelData.title)
      // .field('description', newHotelData.description)
      // .field('guestCount', newHotelData.guestCount)
      // .field('bedroomCount', newHotelData.bedroomCount)
      // .field('bathroomCount', newHotelData.bathroomCount)
      // .field('amenities', newHotelData.amenities)
      // .field('hostInfo', newHotelData.hostInfo)
      // .field('address', newHotelData.address)
      // .field('latitude', newHotelData.latitude)
      // .field('longitude', newHotelData.longitude)
      // .field('rooms', newHotelData.rooms)
      // .attach('images', 'path/to/image1.jpg') // Mock image file path
      // .attach('images', 'path/to/image2.jpg')
      // .attach('roomImage', 'path/to/roomImage1.jpg')
      // .attach('roomImage', 'path/to/roomImage2.jpg');

      

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Hotel created successfully');
    expect(response.body.data.title).toBe(newHotelData.title);
    expect(response.body.data.description).toBe(newHotelData.description);
    expect(response.body.data.images.length).toBe(0); // Check the number of hotel images uploaded
    expect(response.body.data.rooms.length).toBe(1); // Check that room data is included
    expect(response.body.data.rooms[0].roomTitle).toBe('Deluxe Room'); // Check room title
  });

  it('should return error if title or description is missing', async () => {
    const response = await request(app)
      .post('/api/hotel')
      .send({
        guestCount: 4,
        bedroomCount: 2,
        bathroomCount: 2,
        amenities: 'Pool, Spa, Gym',
        hostInfo: 'John Doe',
        address: '123 Hotel Street',
        latitude: '40.712776',
        longitude: '-74.005974',
        rooms: JSON.stringify([
          {
            roomTitle: 'Standard Room',
            bedroomCount: 1,
          },
        ]),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title and description are required');
  });

  it('should return error if file upload fails', async () => {
    const response = await request(app)
      .post('/api/hotel')
      .send({
        title: 'Hotel Without Images',
        description: 'A hotel without any images',
        guestCount: 4,
        bedroomCount: 2,
        bathroomCount: 2,
        amenities: 'Pool, Spa, Gym',
        hostInfo: 'John Doe',
        address: '123 Hotel Street',
        latitude: '40.712776',
        longitude: '-74.005974',
        // images:'invalid/path/to/image.jpg',
        rooms: JSON.stringify([
          {
            roomTitle: 'Basic Room',
            bedroomCount: 1,
          },
        ]),
      })
      // .attach('images', 'invalid/path/to/image.jpg'); // Invalid file path

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error uploading files');
  });


  
  // // Step 1: Define the actual path for the image
  // const imagePath = path.resolve('images', './../resources/a.PNG'); // Adjust the path as necessary
  
  // // Step 2: Read the image file and convert it to base64
  // let base64Image = '';
  
  // fs.readFile(imagePath, (err, data) => {
  //   if (err) {
  //     console.error('Error reading the image file:', err);
  //     return;
  //   }
  
  //   // Step 3: Convert image binary data to base64
  //   base64Image = data.toString('base64');
  
  //   // Step 4: Now use base64Image in your test
  //   describe('POST /api/hotel', () => {
  //     it('should return error if file upload fails', async () => {
  //       const response = await request(app)
  //         .post('/api/hotel')
  //         .send({
  //           title: 'Hotel Without Images',
  //           description: 'A hotel without any images',
  //           guestCount: 4,
  //           bedroomCount: 2,
  //           bathroomCount: 2,
  //           amenities: 'Pool, Spa, Gym',
  //           hostInfo: 'John Doe',
  //           address: '123 Hotel Street',
  //           latitude: '40.712776',
  //           longitude: '-74.005974',
  //           rooms: JSON.stringify([
  //             {
  //               roomTitle: 'Basic Room',
  //               bedroomCount: 1,
  //             },
  //           ]),
  //           images: `data:image/png;base64,${base64Image}` // Send the base64-encoded image
  //         });
  
  //       expect(response.status).toBe(500); // Expecting an error for invalid file path
  //       expect(response.body.error).toBe('Error uploading files');
  //     });
  //   });
  // });
  

  it('should return error if rooms data is not a valid JSON string', async () => {
    const response = await request(app)
      .post('/api/hotel')
      .send({
        title: 'Hotel with Invalid Rooms',
        description: 'Hotel data with invalid rooms JSON',
        guestCount: 4,
        bedroomCount: 2,
        bathroomCount: 2,
        amenities: 'Pool, Spa, Gym',
        hostInfo: 'John Doe',
        address: '123 Hotel Street',
        latitude: '40.712776',
        longitude: '-74.005974',
        rooms: 'invalid json string', // Invalid JSON
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid JSON in rooms data');
  });
});


// import request from 'supertest';


// import app from './../src/app';  // Assuming your Express app is in 'app.ts'
// import fs from 'fs';
// import mockFs from 'mock-fs';
// import slugify from 'slugify';
// import multer from 'multer';
// import path from 'path'

// // Mock dependencies
// jest.mock('slugify', () => jest.fn());
// jest.mock('fs');
// jest.mock('multer');


// //!unit test of create api



// // Cast slugify to a Jest mock function
// const mockedSlugify = slugify as jest.MockedFunction<typeof slugify>;

// // Define the behavior of the slugify mock
// mockedSlugify.mockImplementation((input) => input.toLowerCase());

// // Mock multer directly
// jest.mock('multer', () => {
//   return () => ({
//     fields: jest.fn().mockReturnValue((req, res, cb) => cb(null)),
//   });
// });

// // Test Suite for createHotel API
// describe('POST /hotel', () => {
//   beforeAll(() => {
//     // Mock the file system to prevent actual file operations
//     mockFs({
//       'public/roomView': {},
//       'public/hotelView': {},
//       'uploads': {},
//     });
//   });

//   afterAll(() => {
//     // Restore the file system mock
//     mockFs.restore();
//   });

//   it('should create a hotel successfully with images and rooms', async () => {
//     const mockHotelData = {
//       title: 'Test Hotel',
//       description: 'A great place to stay',
//       guestCount: '10',
//       bedroomCount: '5',
//       bathroomCount: '3',
//       amenities: 'Wifi,Pool,Gym',
//       hostInfo: 'John Doe, johndoe@gmail.com',
//       address: '123 Test St',
//       latitude: '40.7128',
//       longitude: '-74.0060',
//       rooms: JSON.stringify([
//         { roomTitle: 'Deluxe Room', bedroomCount: 2 },
//         { roomTitle: 'Standard Room', bedroomCount: 1 },
//       ]),
//     };

//     const response = await request(app)
//       .post('/hotel')
//       .field('title', mockHotelData.title)
//       .field('description', mockHotelData.description)
//       .field('guestCount', mockHotelData.guestCount)
//       .field('bedroomCount', mockHotelData.bedroomCount)
//       .field('bathroomCount', mockHotelData.bathroomCount)
//       .field('amenities', mockHotelData.amenities)
//       .field('hostInfo', mockHotelData.hostInfo)
//       .field('address', mockHotelData.address)
//       .field('latitude', mockHotelData.latitude)
//       .field('longitude', mockHotelData.longitude)
//       .field('rooms', mockHotelData.rooms);

//     // Assert that the response is correct
//     expect(response.status).toBe(201);
//     expect(response.body.message).toBe('Hotel created successfully');
//     expect(response.body.data).toHaveProperty('id');
//     expect(response.body.data).toHaveProperty('slug');
//     expect(response.body.data.rooms).toHaveLength(2); // Ensure rooms were processed
//   });

//   it('should return 400 when title or description is missing', async () => {
//     const mockHotelData = {
//       title: '',
//       description: 'A great place to stay',
//       guestCount: '10',
//       bedroomCount: '5',
//       bathroomCount: '3',
//       amenities: 'Wifi,Pool,Gym',
//       hostInfo: 'John Doe, johndoe@gmail.com',
//       address: '123 Test St',
//       latitude: '40.7128',
//       longitude: '-74.0060',
//     };

//     const response = await request(app)
//       .post('/hotel')
//       .send(mockHotelData);

//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe('Title and description are required');
//   });

//   it('should return 500 when an error occurs in file upload', async () => {
//     // Simulate an error in the multer upload process
//     const uploadError = new Error('File upload error');
//     (multer().fields as jest.Mock).mockImplementationOnce((fields) => (req, res, cb) => cb(uploadError));

//     const mockHotelData = {
//       title: 'Test Hotel',
//       description: 'A great place to stay',
//       guestCount: '10',
//       bedroomCount: '5',
//       bathroomCount: '3',
//       amenities: 'Wifi,Pool,Gym',
//       hostInfo: 'John Doe, johndoe@gmail.com',
//       address: '123 Test St',
//       latitude: '40.7128',
//       longitude: '-74.0060',
//     };

//     const response = await request(app)
//       .post('/hotel')
//       .send(mockHotelData);

//     expect(response.status).toBe(500);
//     expect(response.body.error).toBe('Error uploading files');
//   });
// });


//!test get by id


describe('getHotel', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    req = {
      params: {
        hotelId: '123', // Sample hotelId
      },
    };

    res = {
      status: statusMock,
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return hotel data when file exists', () => {
    const hotelData = {
      images: ['image1.jpg', 'image2.jpg'],
      rooms: [{ roomTitle: 'Deluxe', roomImage: 'roomImage1.jpg' }],
    };
    const filePath = path.join(__dirname, '../../uploads/123.json');

    // Mock fs.existsSync to return true and fs.readFileSync to return hotel data as JSON
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(hotelData));

    getHotel(req as Request, res as Response);

    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Hotel details retrieved successfully',
      data: {
        ...hotelData,
        images: ['/api/images/hotelView/image1.jpg', '/api/images/hotelView/image2.jpg'],
        rooms: [{ roomTitle: 'Deluxe', roomImage: '/api/images/roomView/roomImage1.jpg' }],
      },
    });
  });

  it('should return 404 if hotel file does not exist', () => {
    const filePath = path.join(__dirname, '../../uploads/123.json');
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    getHotel(req as Request, res as Response);

    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Hotel not found' });
  });

  it('should return 500 if an error occurs during file read', () => {
    const filePath = path.join(__dirname, '../../uploads/123.json');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File read error');
    });

    getHotel(req as Request, res as Response);

    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Error retrieving hotel data',
      details: 'File read error',
    });
  });
});


//!get all hotel api test
describe('GET /api/hotels', () => {
  it('should return a list of all hotels', async () => {
    const hotelsDir = path.join(__dirname, '../../uploads');
    const mockFiles = ['hotel1.json', 'hotel2.json'];

    // Mock fs.readdirSync and fs.readFileSync
    fs.readdirSync = jest.fn().mockReturnValue(mockFiles);
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({
      id: '12345',
      title: 'Test Hotel',
      description: 'A wonderful hotel',
      images: ['image1.jpg'],
      rooms: [{ roomTitle: 'Room 1', roomImage: 'room1.jpg' }],
    }));

    const response = await request(app).get('/api/hotels');
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('All hotels retrieved successfully');
    expect(response.body.data.length).toBe(2);
  });

  it('should return 404 if no hotels are found', async () => {
    fs.readdirSync = jest.fn().mockReturnValue([]);
    
    const response = await request(app).get('/api/hotels');
    
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No hotels found');
  });
});


//!test of put api
describe('PUT /api/hotels/:hotelId', () => {
  it('should update hotel details successfully', async () => {
    const hotelId = '12345';
    const mockFilePath = path.join(__dirname, `../../uploads/${hotelId}.json`);

    // Mock file existence and reading
    const mockHotelData = {
      id: hotelId,
      title: 'Old Hotel Title',
      description: 'Old description',
      images: ['old_image.jpg'],
      rooms: [{ roomTitle: 'Room 1', roomImage: 'old_room.jpg' }],
    };

    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockHotelData));

    const updatedHotelData = {
      title: 'Updated Hotel Title',
      description: 'Updated description',
      guestCount: 6,
      bedroomCount: 4,
      bathroomCount: 3,
      amenities: 'wifi,parking,spa',
      hostInfo: 'Jane Doe',
      address: '123 Updated St',
      latitude: 12.346,
      longitude: 67.891,
      rooms: '[{"roomTitle": "Room 1", "bedroomCount": 3}]',
    };

    const mockFiles = {
      images: [{ filename: 'new_image.jpg' }],
      roomImage: [{ filename: 'new_room.jpg' }],
    };

    const response = await request(app)
      .put(`/api/hotels/${hotelId}`)
      .set('Content-Type', 'multipart/form-data')
      .send(updatedHotelData)
      .attach('images', mockFiles.images[0].filename)
      .attach('roomImage', mockFiles.roomImage[0].filename);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hotel updated successfully');
    expect(response.body.data.title).toBe('Updated Hotel Title');
  });

  it('should return 404 if hotel not found for update', async () => {
    const hotelId = '12345';
    
    fs.existsSync = jest.fn().mockReturnValue(false);

    const response = await request(app).put(`/api/hotels/${hotelId}`).send({
      title: 'Updated Hotel Title',
      description: 'Updated description',
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Hotel not found');
  });
});
