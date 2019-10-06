const mongoose = require('mongoose');



mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author' // reference used to query the collection in mongodb (used when the .find().populate( method is used))
  }
}));


async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    .populate('author', 'name -_id')
    .select('name author')
    .setOptions({ lean: true });
  console.log(courses);
  // console.log(JSON.stringify(courses, undefined, 2));
}

// createAuthor('Mosh', 'My bio', 'My Website');

// createCourse('Node Course', '5d99b4135315a42f315635f1')

listCourses();