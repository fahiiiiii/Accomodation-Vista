"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHotel = exports.getAllHotels = exports.getHotel = exports.createHotel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const slugify_1 = __importDefault(require("slugify"));
const multer_1 = __importDefault(require("multer"));
//!create a hotel 
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'roomImage') {
            cb(null, path_1.default.join(__dirname, '../../public/roomView/'));
        }
        else if (file.fieldname === 'images') {
            cb(null, path_1.default.join(__dirname, '../../public/hotelView/'));
        }
        else {
            cb(new Error('Unknown field for file upload'), '');
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage }).fields([
    { name: 'images', maxCount: 5 }, // Hotel images
    { name: 'roomImage', maxCount: 5 }, // Room images
]);
const createHotel = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error uploading files', details: err });
            return;
        }
        try {
            const { title, description, guestCount, bedroomCount, bathroomCount, amenities, hostInfo, address, latitude, longitude, rooms, // JSON string for room details
             } = req.body;
            // Validate required fields
            if (!title || !description) {
                return res.status(400).json({ error: 'Title and description are required' });
            }
            // Generate a unique slug for the hotel
            const slug = (0, slugify_1.default)(title, { lower: true });
            // Prepare the list of uploaded hotel images
            const images = (req.files && req.files['images'])
                ? req.files['images'].map((file) => file.filename)
                : [];
            // Prepare room images if they exist
            const roomImages = (req.files && req.files['roomImage'])
                ? req.files['roomImage'].map((file) => file.filename)
                : [];
            // Parse rooms data if provided, otherwise set to an empty array
            const roomsData = rooms ? JSON.parse(rooms).map((room, index) => ({
                hotelSlug: slug,
                roomSlug: (0, slugify_1.default)(room.roomTitle, { lower: true }),
                roomImage: roomImages[index] || '', // Assign room image by index if available
                roomTitle: room.roomTitle,
                bedroomCount: room.bedroomCount,
            })) : [];
            // Create the hotel data object including rooms and images
            const hotelData = {
                id: Date.now().toString(),
                slug,
                title,
                description,
                guestCount: Number(guestCount),
                bedroomCount: Number(bedroomCount),
                bathroomCount: Number(bathroomCount),
                amenities: amenities ? amenities.split(',') : [], // Convert amenities from string to array
                hostInfo,
                address,
                latitude: Number(latitude),
                longitude: Number(longitude),
                images,
                rooms: roomsData,
            };
            // Save the hotel data to a JSON file
            const filePath = path_1.default.join(__dirname, `../../uploads/${hotelData.id}.json`);
            fs_1.default.writeFileSync(filePath, JSON.stringify(hotelData));
            // Send success response with hotel data
            res.status(201).json({ message: 'Hotel created successfully', data: hotelData });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    });
};
exports.createHotel = createHotel;
//!get hotel by id
// export const getHotel = (req: Request, res: Response): void => {
//   const { hotelId } = req.params;
//   try {
//     const filePath = path.join(__dirname, `../../uploads/${hotelId}.json`);
//     if (!fs.existsSync(filePath)) {
//       res.status(404).json({ error: 'Hotel not found' });
//       return;
//     }
//     const hotelData: Hotel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//     // Generate URLs for hotel images (now it will link to the actual image file on the server)
//     hotelData.images = hotelData.images.map(image => `/uploads/images/hotelView/${image}`);
//     // Generate URLs for each room image (assuming images are stored under 'roomView' folder)
//     hotelData.rooms = hotelData.rooms.map((room: Room) => ({
//       ...room,
//       roomImage: `/uploads/images/roomView/${room.roomImage}`,
//     }));
//     res.status(200).json({ message: 'Hotel details retrieved successfully', data: hotelData });
//   } catch (error: any) {
//     console.error('Error retrieving hotel:', error);
//     res.status(500).json({ error: 'Error retrieving hotel data', details: error.message });
//   }
// };
const getHotel = (req, res) => {
    const { hotelId } = req.params;
    try {
        const filePath = path_1.default.join(__dirname, `../../uploads/${hotelId}.json`);
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ error: 'Hotel not found' });
            return;
        }
        const hotelData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        // Generate URLs for hotel images
        hotelData.images = hotelData.images.map(image => `/api/images/hotelView/${image}`);
        // Generate URLs for each room image
        hotelData.rooms = hotelData.rooms.map((room) => (Object.assign(Object.assign({}, room), { roomImage: `/api/images/roomView/${room.roomImage}` })));
        res.status(200).json({ message: 'Hotel details retrieved successfully', data: hotelData });
        return;
    }
    catch (error) {
        console.error('Error retrieving hotel:', error);
        res.status(500).json({ error: 'Error retrieving hotel data', details: error.message });
        return;
    }
};
exports.getHotel = getHotel;
//!get all hotel
// export const getAllHotels = (req: Request, res: Response): void => {
//   try {
//     const directoryPath = path.join(__dirname, '../../uploads');
//     const hotelFiles = fs.readdirSync(directoryPath);
//     const hotels = hotelFiles.map((file) => {
//       const filePath = path.join(directoryPath, file);
//       const hotelData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//       return hotelData;
//     });
//     res.status(200).json({ message: 'Hotels retrieved successfully', data: hotels });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error retrieving hotels' });
//   }
// };
const getAllHotels = (req, res) => {
    try {
        // Path to the folder where hotel JSON files are stored
        const hotelsDir = path_1.default.join(__dirname, '../../uploads');
        // Read all the files in the uploads directory
        const hotelFiles = fs_1.default.readdirSync(hotelsDir);
        // Filter only JSON files
        const hotelJsonFiles = hotelFiles.filter(file => file.endsWith('.json'));
        if (hotelJsonFiles.length === 0) {
            res.status(404).json({ error: 'No hotels found' });
            return;
        }
        // Read and parse each hotel JSON file
        const hotelsData = hotelJsonFiles.map(file => {
            const filePath = path_1.default.join(hotelsDir, file);
            const hotelData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
            // Check for images and ensure it's an array
            if (!hotelData.images || !Array.isArray(hotelData.images)) {
                console.warn(`'images' is missing or not an array in hotel: ${file}`);
                hotelData.images = []; // Set it to an empty array if missing or not an array
            }
            else {
                // Generate URLs for each image
                hotelData.images = hotelData.images.map(image => `/api/images/hotelView/${image}`);
            }
            // Check for rooms and ensure it's an array
            if (!hotelData.rooms || !Array.isArray(hotelData.rooms)) {
                console.warn(`'rooms' is missing or not an array in hotel: ${file}`);
                hotelData.rooms = []; // Set it to an empty array if missing or not an array
            }
            else {
                // Generate URLs for each room's image
                hotelData.rooms = hotelData.rooms.map((room) => (Object.assign(Object.assign({}, room), { roomImage: room.roomImage ? `/api/images/roomView/${room.roomImage}` : '' })));
            }
            return hotelData;
        });
        // Sort hotels by 'id' in descending order (latest hotel first)
        hotelsData.sort((a, b) => Number(b.id) - Number(a.id));
        // Send the response with all hotels data, sorted by latest creation time
        res.status(200).json({ message: 'All hotels retrieved successfully', data: hotelsData });
    }
    catch (error) {
        console.error('Error retrieving hotels:', error);
        res.status(500).json({ error: 'Error retrieving hotels data', details: error.message });
    }
};
exports.getAllHotels = getAllHotels;
// export const getAllHotels = (req: Request, res: Response): void => {
//   try {
//     // Path to the folder where hotel JSON files are stored
//     const hotelsDir = path.join(__dirname, '../../uploads');
//     // Read all the files in the uploads directory
//     const hotelFiles = fs.readdirSync(hotelsDir);
//     // Filter only JSON files
//     const hotelJsonFiles = hotelFiles.filter(file => file.endsWith('.json'));
//     if (hotelJsonFiles.length === 0) {
//        res.status(404).json({ error: 'No hotels found' });
//        return;
//     }
//     // Read and parse each hotel JSON file
//     const hotelsData: Hotel[] = hotelJsonFiles.map(file => {
//       const filePath = path.join(hotelsDir, file);
//       const hotelData: Hotel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//       // Generate URLs for hotel images
//       hotelData.images = hotelData.images.map(image => `/api/images/hotelView/${image}`);
//       // Generate URLs for each room image
//       hotelData.rooms = hotelData.rooms.map((room: Room) => ({
//         ...room,
//         roomImage: `/api/images/roomView/${room.roomImage}`,
//       }));
//       return hotelData;
//     });
//     // Send the response with all hotels data
//     res.status(200).json({ message: 'All hotels retrieved successfully', data: hotelsData });
//   } catch (error: any) {
//     console.error('Error retrieving hotels:', error);
//     res.status(500).json({ error: 'Error retrieving hotels data', details: error.message });
//   }
// };
//!update hotel by using id
const updateHotel = (req, res) => {
    const { hotelId } = req.params; // The hotel ID from the URL
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error uploading files', details: err });
            return;
        }
        try {
            // Read the hotel file based on the provided hotelId
            const filePath = path_1.default.join(__dirname, `../../uploads/${hotelId}.json`);
            if (!fs_1.default.existsSync(filePath)) {
                res.status(404).json({ error: 'Hotel not found' });
                return;
            }
            const hotelData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
            // Retrieve data from the request body
            const { title, description, guestCount, bedroomCount, bathroomCount, amenities, hostInfo, address, latitude, longitude, rooms, // JSON string for room details
             } = req.body;
            // Validate required fields
            if (!title || !description) {
                res.status(400).json({ error: 'Title and description are required' });
                return;
            }
            // Update hotel data
            hotelData.title = title;
            hotelData.description = description;
            hotelData.guestCount = Number(guestCount);
            hotelData.bedroomCount = Number(bedroomCount);
            hotelData.bathroomCount = Number(bathroomCount);
            hotelData.amenities = amenities ? amenities.split(',') : [];
            hotelData.hostInfo = hostInfo;
            hotelData.address = address;
            hotelData.latitude = Number(latitude);
            hotelData.longitude = Number(longitude);
            // Handle uploaded hotel images
            if (req.files && req.files['images']) {
                const uploadedHotelImages = req.files['images'].map((file) => file.filename);
                hotelData.images = uploadedHotelImages; // Update the hotel images
            }
            // Handle room images if any
            const roomImages = (req.files && req.files['roomImage'])
                ? req.files['roomImage'].map((file) => file.filename)
                : [];
            // Parse rooms data if provided
            const roomsData = rooms ? JSON.parse(rooms).map((room, index) => ({
                hotelSlug: hotelData.slug,
                roomSlug: (0, slugify_1.default)(room.roomTitle, { lower: true }),
                roomImage: roomImages[index] || '', // Assign room image by index if available
                roomTitle: room.roomTitle,
                bedroomCount: room.bedroomCount,
            })) : [];
            hotelData.rooms = roomsData; // Update hotel rooms
            // Save the updated hotel data back to the JSON file
            fs_1.default.writeFileSync(filePath, JSON.stringify(hotelData));
            // Send success response with updated hotel data
            res.status(200).json({ message: 'Hotel updated successfully', data: hotelData });
        }
        catch (error) {
            console.error('Error updating hotel:', error);
            res.status(500).json({ error: 'Error updating hotel data', details: error.message });
        }
    });
};
exports.updateHotel = updateHotel;
// export const updateHotel = (req: Request, res: Response): void => {
//   const { hotelId } = req.params; // The hotel ID from the URL
//   upload(req, res, (err: any) => {
//     if (err) {
//       res.status(500).json({ error: 'Error uploading files', details: err });
//       return;
//     }
//     try {
//       // Read the hotel file based on the provided hotelId
//       const filePath = path.join(__dirname, `../../uploads/${hotelId}.json`);
//       if (!fs.existsSync(filePath)) {
//         res.status(404).json({ error: 'Hotel not found' });
//         return;
//       }
//       const hotelData: Hotel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//       // Retrieve data from the request body
//       const {
//         title,
//         description,
//         guestCount,
//         bedroomCount,
//         bathroomCount,
//         amenities,
//         hostInfo,
//         address,
//         latitude,
//         longitude,
//         rooms, // JSON string for room details
//       } = req.body;
//       // Validate required fields
//       if (!title || !description) {
//         res.status(400).json({ error: 'Title and description are required' });
//         return;
//       }
//       // Update hotel data
//       hotelData.title = title;
//       hotelData.description = description;
//       hotelData.guestCount = Number(guestCount);
//       hotelData.bedroomCount = Number(bedroomCount);
//       hotelData.bathroomCount = Number(bathroomCount);
//       hotelData.amenities = amenities ? amenities.split(',') : [];
//       hotelData.hostInfo = hostInfo;
//       hotelData.address = address;
//       hotelData.latitude = Number(latitude);
//       hotelData.longitude = Number(longitude);
//       // Handle uploaded hotel images
//       if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })['images']) {
//         const uploadedHotelImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'].map((file) => file.filename);
//         hotelData.images = uploadedHotelImages; // Update the hotel images
//       }
//       // Handle room images if any
//       // if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })['roomImage']) {
//       //   const roomImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['roomImage'].map((file) => file.filename);
//       //   console.log('Uploaded room images:', roomImages);  // Debugging log
//         // Check if roomImages are available, then apply them to the rooms
//       //   // Check for rooms and ensure it's an array
//       // if (!hotelData.rooms || !Array.isArray(hotelData.rooms)) {
//       //   console.warn(`'rooms' is missing or not an array in hotel: ${File}`);
//       //   hotelData.rooms = [];  // Set it to an empty array if missing or not an array
//       // } else {
//       //   // Generate URLs for each room's image
//       //   hotelData.rooms = hotelData.rooms.map((room: Room) => ({
//       //     ...room,
//       //     roomImage: room.roomImage ? `/api/images/roomView/${room.roomImage}` : '',  // Default empty if no room image
//       //   }));
//       // }
//       // Prepare room images if they exist
//       // const roomImages = (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })['roomImage'])
//       //   ? (req.files as { [fieldname: string]: Express.Multer.File[] })['roomImage'].map((file) => file.filename)
//       //   : [];
//       // // Parse rooms data if provided
//       // if (rooms) {
//       //   const roomsData: Room[] = JSON.parse(rooms).map((room: any, index: number) => ({
//       //     hotelSlug: hotelData.slug,
//       //     roomSlug: slugify(room.roomTitle, { lower: true }),
//       //   roomImage: roomImages[index] || '',  // Assign room image by index if available
//       //     roomTitle: room.roomTitle,
//       //     bedroomCount: room.bedroomCount,
//       //   }));
//       //   hotelData.rooms = roomsData;
//       // }
//       // Prepare room images if they exist
//       const roomImages = (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })['roomImage'])
//         ? (req.files as { [fieldname: string]: Express.Multer.File[] })['roomImage'].map((file) => file.filename)
//         : [];
//       // Parse rooms data if provided, otherwise set to an empty array
//       const roomsData: Room[] = rooms ? JSON.parse(rooms).map((room: any, index: number) => ({
//         hotelSlug: hotelData.slug,
//         roomSlug: slugify(room.roomTitle, { lower: true }),
//         roomImage: roomImages[index] || '',  // Assign room image by index if available
//         roomTitle: room.roomTitle,
//         bedroomCount: room.bedroomCount,
//       })) : [];
//       hotelData.rooms = roomsData
//       // Save the updated hotel data back to the JSON file
//       fs.writeFileSync(filePath, JSON.stringify(hotelData));
//       // Send success response with hotel data
//       res.status(201).json({ message: 'Hotel created successfully', data: hotelData });
//       // Send success response with updated hotel data
//       res.status(200).json({ message: 'Hotel updated successfully', data: hotelData });
//     } catch (error: any) {
//       console.error('Error updating hotel:', error);
//       res.status(500).json({ error: 'Error updating hotel data', details: error.message });
//     }
//   });
// };
// export const updateHotel = (req: Request, res: Response): void => {
//   const { hotelId } = req.params; // The hotel ID from the URL
//   upload(req, res, (err: any) => {
//     if (err) {
//        res.status(500).json({ error: 'Error uploading files', details: err });
//        return
//     }
//     try {
//       // Read the hotel file based on the provided hotelId
//       const filePath = path.join(__dirname, `../../uploads/${hotelId}.json`);
//       if (!fs.existsSync(filePath)) {
//          res.status(404).json({ error: 'Hotel not found' });
//          return
//       }
//       const hotelData: Hotel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//       // Retrieve data from the request body
//       const {
//         title,
//         description,
//         guestCount,
//         bedroomCount,
//         bathroomCount,
//         amenities,
//         hostInfo,
//         address,
//         latitude,
//         longitude,
//         rooms, // JSON string for room details
//       } = req.body;
//       // Validate required fields
//       if (!title || !description) {
//          res.status(400).json({ error: 'Title and description are required' });
//          return
//       }
//       // Update hotel data
//       hotelData.title = title;
//       hotelData.description = description;
//       hotelData.guestCount = Number(guestCount);
//       hotelData.bedroomCount = Number(bedroomCount);
//       hotelData.bathroomCount = Number(bathroomCount);
//       hotelData.amenities = amenities ? amenities.split(',') : []; // Convert amenities from string to array
//       hotelData.hostInfo = hostInfo;
//       hotelData.address = address;
//       hotelData.latitude = Number(latitude);
//       hotelData.longitude = Number(longitude);
//       // Prepare the list of uploaded hotel images if any
//       if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })['images']) {
//         const uploadedHotelImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'].map((file) => file.filename);
//         hotelData.images = uploadedHotelImages; // Update the hotel images
//       }
//       // Prepare room images if any
//       if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })['roomImage']) {
//         const roomImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['roomImage'].map((file) => file.filename);
//         // Update room images for each room
//         hotelData.rooms = hotelData.rooms.map((room: Room, index: number) => ({
//           ...room,
//           roomImage: roomImages[index] || room.roomImage, // Assign new image if available
//         }));
//       }
//       // Parse rooms data if provided, otherwise keep existing rooms data
//       if (rooms) {
//         const roomsData: Room[] = JSON.parse(rooms).map((room: any, index: number) => ({
//           hotelSlug: hotelData.slug,
//           roomSlug: slugify(room.roomTitle, { lower: true }),
//           roomImage: room.roomImage || '',  // Room image should be optional
//           roomTitle: room.roomTitle,
//           bedroomCount: room.bedroomCount,
//         }));
//         hotelData.rooms = roomsData;
//       }
//       // Save the updated hotel data back to the JSON file
//       fs.writeFileSync(filePath, JSON.stringify(hotelData));
//       // Send success response with updated hotel data
//       res.status(200).json({ message: 'Hotel updated successfully', data: hotelData });
//     } catch (error: any) {
//       console.error('Error updating hotel:', error);
//       res.status(500).json({ error: 'Error updating hotel data', details: error.message });
//     }
//   });
// };
