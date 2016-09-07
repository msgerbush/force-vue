<template>
  <div class="mdl-cell mdl-cell--11-col">
    <div class="person-actions">
      <mdl-textfield class="searchPersonField" :value.sync="personSearchTerm" @keyup.enter="searchPerson"></mdl-textfield>
      <mdl-button class="searchPersonBtn" v-mdl-ripple-effect colored icon raised @click="searchPerson">
        Search
      </mdl-button>
      <mdl-button class="randPersonBtn" v-mdl-ripple-effect colored icon raised @click="fetchRandomPerson">
        <i class="material-icons">face</i> Random Person
      </mdl-button>
      <span v-show="searchMsg">{{searchMsg}}</span>
    </div>
    <div class="mdl-grid person-cards">
      <div class="mdl-cell mdl-card mdl-shadow--4dp portfolio-card">
        <mdl-textfield floating-label="Name" :value="personData.name"></mdl-textfield>
        <mdl-textfield floating-label="Height" :value="personData.height"></mdl-textfield>
        <mdl-textfield floating-label="Mass" :value="personData.mass"></mdl-textfield>
        <mdl-textfield floating-label="Hair Color" :value="personData.hair_color"></mdl-textfield>
        <mdl-textfield floating-label="Eye Color" :value="personData.eye_color"></mdl-textfield>
        <mdl-textfield floating-label="Birth Year" :value="personData.birth_year"></mdl-textfield>
        <mdl-textfield floating-label="Gender" :value="personData.gender"></mdl-textfield>
      </div>
      <div class="mdl-cell mdl-card mdl-shadow--4dp">
        <figure class="mdl-card__media">
          <div v-show="loadingImg" class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
          <div v-else>
            <img v-show="personImage" :src="personImage">
            <span v-else>{{personImageMsg}}</span>
          </div>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import person from '../api/person';
import { MdlButton, MdlTextfield, directives } from 'vue-mdl';

export default {
  components: {
    MdlButton,
    MdlTextfield,
  },
  directives,
  data() {
    return {
      personData: {
        name: '',
        height: '',
        mass: '',
        hair_color: '',
        eye_color: '',
        birth_year: '',
        gender: '',
      },
      personImage: '',
      personImageMsg: '',
      searchMsg: '',
      personSearchTerm: '',
      loadingImg: false,
    };
  },
  methods: {
    searchPerson() {
      this.personImageMsg = '';
      this.searchMsg = 'Loading...';
      person.search(this.personSearchTerm).then((personData) => {
        if (personData) {
          this.personData = Object.assign(this.personData, personData);
          this.searchMsg = '';
          this.loadingImg = true;
          person.getPicture(this.personData.name).then((data) => {
            this.personImage = data;
            if (!data) { this.personImageMsg = 'No image found.'; }
            this.loadingImg = false;
          });
        } else {
          this.personData = Object.assign(this.personData, {
            name: '',
            height: '',
            mass: '',
            hair_color: '',
            eye_color: '',
            birth_year: '',
            gender: '',
          });
          this.personImage = '';
          this.searchMsg = 'No person found.';
        }
      });
    },
    fetchRandomPerson() {
      this.searchMsg = '';
      this.personSearchTerm = '';
      this.personImageMsg = '';
      const randomPersonId = Math.floor((Math.random() * 87) + 1);
      person.fetch(randomPersonId).then((personData) => {
        this.personData = Object.assign(this.personData, personData);
        this.loadingImg = true;
        person.getPicture(this.personData.name).then((data) => {
          this.personImage = data;
          if (!data) { this.personImageMsg = 'No image found.'; }
          this.loadingImg = false;
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: black;
}
figure img {
  width: 285px;
}
.mdl-card__media {
  background-color: #FFF;
}

.person-cards {
  padding: 0;
  margin: 0 -8px;
}
</style>
