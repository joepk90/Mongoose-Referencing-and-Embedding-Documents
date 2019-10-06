const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(console.log(JSON.stringify(result, undefined, 2)));
}

async function listCourses() { 
  const courses = await Course.find().setOptions({ lean: true });
  console.log(courses);
}

async function updateAuthor(id) {

// query first
// const course = await Course.findById(id);
// course.authors.name = "updated name";
// course.save();

// update directly
const course = await Course.update({ _id: id }, {

  // update authors name
  // $set: {
  //   'authors.name': 'Joe'
  // }

  // remove authors object completly
  $unset: {
    'authors': ''
  }

  });

}

async function addAuthor(courseId, author) {

  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();

}

async function removeAuthor(courseId, authorId) {

  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();

}

// updateAuthor('5d99c299678b33322844e4b1');

// createCourse('Node Course', [
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'Joe' }),
//   new Author({ name: 'John' })
// ]);

// addAuthor('5d99c862a9ba4633b2cdf528', new Author({ name: 'Jake' }))
removeAuthor('5d99c862a9ba4633b2cdf528', '5d99c959b2045233f3f9bf88')
