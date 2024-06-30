const request = require('supertest');
const app = require('../../app');

describe('GET /campgrounds', () => {
    it('should respond with an object body and status 200', async () => {
      const response = await request(app).get('/campgrounds');
      
      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
    });
  });

  describe('POST /campgrounds', () => { 
    it('should create a new campground and handle redirect (status 302)', async () => {
      const newCampground = {
        title: 'Test Campground',
        price: 25,
        description: 'This is a test campground',
        location: 'Test Location',
        geometry: {
          type: 'Point',
          coordinates: [ -73.856077, 40.848447 ]
        }
      };
  
      const response = await request(app)
        .post('/campgrounds')
        .send(newCampground);
  
      // Assertions
      expect(response.status).toBe(302); 
      expect(response.header['location']).toBeTruthy();
  
      const redirectResponse = await request(app).get(response.header['location']);
      expect(redirectResponse.status).toBe(200);
      });
    });
    
    describe('GET /campgrounds/new', () => {
      it('responds with HTML containing the new campground form or redirects to login', async () => {
        const response = await request(app).get('/campgrounds/new');
    
        // Check if the response is a redirect (status 302)
        if (response.status === 302) {
          expect(response.headers.location).toBe('/login');
    
          const redirectedResponse = await request(app).get(response.headers.location);
    
          expect(redirectedResponse.status).toBe(200);
          expect(redirectedResponse.text).toContain('<form');
        } else {
          // If not redirected, expect HTML containing the new campground form
          expect(response.status).toBe(200);
          expect(response.text).toContain('<form');
          expect(response.text).toContain('action="/campgrounds"');
          expect(response.text).toContain('<input type="text" id="title" name="campground[title]"');
          expect(response.text).toContain('<input type="text" id="location" name="campground[location]"');
          expect(response.text).toContain('<textarea id="description" name="campground[description]"');
          expect(response.text).toContain('<input type="file" class="form-control d-none" id="image" name="image" multiple required');
        }
      });
    });

    describe('GET /:id', () => {    
      it('redirects to /campgrounds for invalid ID', async () => {
        const invalidCampgroundId = '667aa50bfeed80d432205e7css';
    
        const response = await request(app).get(`/campgrounds/${invalidCampgroundId}`);
    
        expect(response.status).toBe(302); 
        expect(response.header.location).toBe('/campgrounds');
      });
    });

    
    

    
