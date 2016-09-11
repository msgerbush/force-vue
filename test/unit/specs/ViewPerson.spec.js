import Vue from 'vue';
import ViewPerson from 'src/components/ViewPerson';

const personInjector = require('!!vue?inject!src/components/ViewPerson');

const examplePerson = {
  name: 'Test Name',
  height: 'Test Height',
  mass: 'Test Mass',
  hair_color: 'Test Hair Color',
  eye_color: 'Test Eye Color',
  birth_year: 'Test Birthy Year',
  gender: 'Test Gender',
};

const exampleImageURL = 'http://i.imgur.com/YfGtG9Dm.jpg';

/**
 * Mock event helper
 */

function trigger(target, event, process) {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(event, true, true);
  if (process) process(e);
  target.dispatchEvent(e);
}

describe('ViewPerson.vue', () => {
  it('should render a random person button', () => {
    const vm = new Vue({
      template: '<div><view-person></view-person></div>',
      components: { ViewPerson },
    }).$mount();

    expect(vm.$el.querySelector('.randPersonBtn').textContent).to.contain('Random Person');
  });

  it('should render a search field and search button', () => {
    const vm = new Vue({
      template: '<div><view-person></view-person></div>',
      components: { ViewPerson },
    }).$mount();

    expect(vm.$el.querySelector('.searchPersonBtn')).to.exist();
    expect(vm.$el.querySelector('.searchPersonField')).to.exist();
  });

  it('should render a card for the person', (done) => {
    const vm = new Vue({
      template: '<div><view-person v-ref:person></view-person></div>',
      components: { ViewPerson },
    }).$mount();
    const comp = vm.$refs.person;

    expect(vm.$el.querySelector('.person-data-card').textContent).to.exist();
    comp.personData = examplePerson;
    comp.$nextTick(() => {
      expect(vm.$el.querySelector('.person-data-card__name input').value)
        .to.equal(examplePerson.name);
      done();
    });
  });

  it('should render a card for the image', (done) => {
    const vm = new Vue({
      template: '<div><view-person v-ref:person></view-person></div>',
      components: { ViewPerson },
    }).$mount();
    const comp = vm.$refs.person;

    expect(comp.$el.querySelector('.person-image-card').textContent).to.exist();
    comp.personImage = exampleImageURL;
    comp.$nextTick(() => {
      expect(comp.$el.querySelector('.person-image-card img').src)
        .to.equal(exampleImageURL);
      done();
    });
  });

  it('should render an empty message for when there is no image', (done) => {
    const vm = new Vue({
      template: '<div><view-person v-ref:person></view-person></div>',
      components: { ViewPerson },
    }).$mount();
    const comp = vm.$refs.person;

    comp.personImage = '';
    comp.personImageMsg = 'Hello, friend!';
    comp.$nextTick(() => {
      expect(vm.$el.querySelector('.person-image-card__message').textContent)
        .to.equal(comp.personImageMsg);
      done();
    });
  });

  it('should render a search message for when there is a failed search', (done) => {
    const vm = new Vue({
      template: '<div><view-person v-ref:person></view-person></div>',
      components: { ViewPerson },
    }).$mount();
    const comp = vm.$refs.person;

    comp.searchMsg = 'Hello, friend!';
    comp.$nextTick(() => {
      expect(vm.$el.querySelector('.searchMsg').textContent)
        .to.equal(comp.searchMsg);
      done();
    });
  });

  it('should get a random person and image when the random button is clicked', (done) => {
    const fetch = sinon.stub().returns(Promise.resolve(examplePerson));
    const getPicture = sinon.stub().returns(Promise.resolve(exampleImageURL));
    const ViewPersonWithMocks = personInjector({
      '../api/person': { fetch, getPicture },
    });
    const vm = new Vue({
      template: '<div><view-person-with-mocks v-ref:person></view-person-with-mocks></div>',
      components: { ViewPersonWithMocks },
    }).$mount();
    const comp = vm.$refs.person;

    trigger(vm.$el.querySelector('.randPersonBtn'), 'click');
    comp.$nextTick(() => {
      expect(fetch).to.have.been.called();
      expect(comp.personData).to.eql(examplePerson);
      expect(getPicture).to.have.been.calledWith(examplePerson.name);
      expect(comp.personImage).to.equal(exampleImageURL);
      done();
    });
  });

  it('should get a searched person and image when a search term is submitted', (done) => {
    const search = sinon.stub().returns(Promise.resolve(examplePerson));
    const getPicture = sinon.stub().returns(Promise.resolve(exampleImageURL));
    const ViewPersonWithMocks = personInjector({
      '../api/person': { search, getPicture },
    });
    const vm = new Vue({
      template: '<div><view-person-with-mocks v-ref:person></view-person-with-mocks></div>',
      components: { ViewPersonWithMocks },
    }).$mount();
    const comp = vm.$refs.person;
    const searchTerm = 'C-3PO';

    comp.personSearchTerm = searchTerm;
    trigger(vm.$el.querySelector('.searchPersonBtn'), 'click');
    comp.$nextTick(() => {
      expect(search).to.have.been.calledWith(searchTerm);
      expect(getPicture).to.have.been.calledWith(examplePerson.name);
      expect(comp.personData).to.eql(examplePerson);
      expect(comp.personImage).to.equal(exampleImageURL);
      done();
    });
  });

  it('should render a searched person without an image', (done) => {
    const search = sinon.stub().returns(Promise.resolve(examplePerson));
    const getPicture = sinon.stub().returns(Promise.resolve(''));
    const ViewPersonWithMocks = personInjector({
      '../api/person': { search, getPicture },
    });
    const vm = new Vue({
      template: '<div><view-person-with-mocks v-ref:person></view-person-with-mocks></div>',
      components: { ViewPersonWithMocks },
    }).$mount();
    const comp = vm.$refs.person;
    const searchTerm = 'C-3PO';

    comp.personSearchTerm = searchTerm;
    trigger(vm.$el.querySelector('.searchPersonBtn'), 'click');
    comp.$nextTick(() => {
      expect(search).to.have.been.calledWith(searchTerm);
      expect(getPicture).to.have.been.calledWith(examplePerson.name);
      expect(comp.personData).to.eql(examplePerson);
      expect(comp.personImage).to.equal('');
      expect(comp.personImageMsg).to.equal('No image found.');
      done();
    });
  });

  it('should render "No Person Found." when a search does not return a person', (done) => {
    const search = sinon.stub().returns(Promise.resolve(null));
    const getPicture = sinon.stub().returns(Promise.resolve(''));
    const ViewPersonWithMocks = personInjector({
      '../api/person': { search, getPicture },
    });
    const vm = new Vue({
      template: '<div><view-person-with-mocks v-ref:person></view-person-with-mocks></div>',
      components: { ViewPersonWithMocks },
    }).$mount();
    const comp = vm.$refs.person;
    const emptyPerson = {
      name: '',
      height: '',
      mass: '',
      hair_color: '',
      eye_color: '',
      birth_year: '',
      gender: '',
    };
    const searchTerm = 'C-3PO';

    comp.personSearchTerm = searchTerm;
    trigger(vm.$el.querySelector('.searchPersonBtn'), 'click');
    comp.$nextTick(() => {
      expect(search).to.have.been.calledWith(searchTerm);
      expect(getPicture).to.have.not.been.called();
      expect(comp.personData).to.eql(emptyPerson);
      expect(comp.searchMsg).to.equal('No person found.');
      expect(comp.personImage).to.equal('');
      expect(comp.personImageMsg).to.equal('');
      done();
    });
  });
});
