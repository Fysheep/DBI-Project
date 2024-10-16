<script lang="ts">

export default {
  components: {
  },
  data() {
    return {

    }
  },
}
</script>

<template>
  <main class="dp-flex fd-c gap-3">
    <h1 class="ta-center">Home</h1>

    <div class="ta-center">
      Welcome to the <b> Trackmania Archive</b>, where you can see and edit Sample Data with an underlying MongoDB.
    </div>
    <div class="ta-center">
      This page will present and demonstrate the technologies and logical steps taken in the project
    </div>
    <div class="dp-flex jc-c">
      <p class="para-card">
        <img src="../assets/img/meme.png" width="500" />
      </p>
    </div>
    <h1 class="ta-center">Relational Schema</h1>
    <div class="dp-flex jc-c gap-4">
      <p class="para-card"><img src="../assets/img/RelDesign.png" width="500"></p>
      <p class="para-card">Because of the Requirement of 2 Tables, we use Skins per Player, which is pretty straight
        forward in SQL. We need atleast one Primary Key for users and one for skins. Then we add some columns which make
        sense. That means adding username, country and competitive points for the user. Not to forget code, name and
        creator column for the skins table </p>
    </div>
    <h1 class="ta-center">Relational Test Data</h1>
    <div class="dp-flex jc-c gap-4">
      <p class="para-card dp-flex jc-c">
        <img src="../assets/img/RelUsers.png" width="40%">
        <img src="../assets/img/RelSkins.png" width="58%">
      </p>
      <p class="para-card dp-flex jc-c" style="width: 35%;">
        For the Test Data, our favourite transformer can supply a vast amount of help. After explaining the model, it
        generates some nice users with their country and the respective skins table
      </p>
    </div>
    <h1 class="ta-center"> NoSQL Schema</h1>
    <div class="dp-flex jc-c gap-4">
      <p class="para-card dp-flex jc-c">
        <img src="../assets/img/nosqlDesign.png" width="700">
      </p>
      <p class="para-card dp-flex jc-c">
        Now for NoSql: Using the Embedded Technique which was presented by Fr. Prof. Niklas, we can pretty much insert
        the skins table into our users table which creates a Schema as seen on the ( LEFT ).
      </p>
    </div>
  </main>
</template>
