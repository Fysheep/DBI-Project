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
    <h1 class="ta-center"> NoSQL / SQL Differences</h1>
    <div class="dp-flex jc-c gap-4">
      <div class="para-card dp-flex fd-c jc-c">
        <img src="../assets/img/MongoVsSqLite.png" class="blue-shadow">
      </div>
      <div class="para-card dp-flex fd-c ai-c">
        <p>
          By using MongoDB, we can ignore old-school problems like varchar sizes, decimal specifications and when using
          it
          with embedded objects, we can also scrape off the primary key and foreign key in some scenarios
        </p>
        <p>
          However, because this project uses SQLite for comparison, SQL seems a lot more sexy when comparing the
          performance tests. Lucky for NoSQL enjoyers, this is just a false sense of security, because there is near 0
          scaling possibility. SQLite saves all tables in a file, which means that it can only be accessed via one
          controller. Read and Write speed on the file system is very important here, aswell as Random Access Memory
          Speed for working with that data. Because of the supplied info, there is no horizontal scaling, just vertical
          scaling (which has a limit and is unpredictably cost-intensive).
        </p>
        <p>
          Edit: It appears that after implementing MySQL as a Test-subject, SQLite is not the king of the hill anymore.
          MySQL destroys the testing times of the other.
        </p>
        <p>
          Another Thing that might clear up confusion on the performance tests is that the mongodb tests are being done
          on the atlas-cloud with atlas search. This means that the time of mongo contains: latency, index creation, (no
          use of RAM, rather CPU which is slower), use of mongoose which health-checks the documents before insertion
          etc.
        </p>
      </div>
    </div>
    <h1 class="ta-center">Mongo Indexes & Atlas Search</h1>
    <div class="dp-flex jc-c gap-4">
      <div class="para-card dp-flex fd-c jc-c">
        <p>
          Mongo provides the Index functionality, which can be quite useful for faster query times. On the other hand,
          creation and updating processes are slower. When inserting a document, Mongodb has to use a predefined (user
          selected) way of summarizing the data. An update to a document has to change the index, so the queries will
          not return obsolete data.
        </p>
        <p>
          Atlas Search uses this Index feature to generate a searchable "string". This can not easily be compared to
          other databases, because it lightly bruteforces combinations of letter-changes from query to index. This index
          may only be used with aggregate, because of the complex nature of the querying.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.blue-shadow {
  filter: drop-shadow(0 0 10px #32475B);
  border-radius: 1rem;
}
</style>
