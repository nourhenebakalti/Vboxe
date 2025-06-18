package com.Gadour.App.Repository;

import com.Gadour.App.Model.UserConnexionCount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;


import org.springframework.stereotype.Repository;


import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Repository
public class UserRepo {
    @Autowired
    MongoOperations mongoOperations;

    @Autowired
    MongoTemplate mongoTemplate;

    public void deleteGuest() {
        //mongoTemplate.remove(Query.query(Criteria.where("role").is("ROLE_GUEST").and(Criteria.where("lastOnLine").)));

        //mongoOperations.indexOps(DAOUser.class).ensureIndex(new Index().on("createdAt", Sort.Direction.ASC).expire(7200)) ;

		/*mongoTemplate.indexOps("Users").ensureIndex(
			    new Index().on("createdAt", Sort.Direction.ASC)
			        .expire(7200));*/

    }

    public List<UserConnexionCount> usercount(int year  , int month ) {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.project("id_client")
                        .and(DateOperators.Month.monthOf(
                                "Connexion_date")).as("month")
                        .and(DateOperators.Year.yearOf("Connexion_date")).as("year")
                        .and(DateOperators.DayOfMonth.dayOfMonth("Connexion_date")).as("day"),
                Aggregation.match(new Criteria("month").is(month)),
                Aggregation.match(new Criteria("year").is(year)),
                Aggregation.group("id_client","day"),
                group("_id.id_client").count().as("distinctUserCount"),
                Aggregation.project("id_client").and("distinctUserCount").as("jours")
                        .and(ConvertOperators.ToObjectId.toObjectId("$_id")).as("userId"),
                Aggregation.lookup("Users","userId","_id","users"),
                Aggregation.project("users.name","users.username","jours")
        );
        List<UserConnexionCount> results = mongoOperations.aggregate(agg , "Connexions", UserConnexionCount.class).getMappedResults();
        return results;
    }

    public List<UserConnexionCount> countConnexionJour(int day, int month , int year) {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.project("id_client")
                        .and(DateOperators.Month.monthOf(
                                "Connexion_date")).as("month")
                        .and(DateOperators.Year.yearOf("Connexion_date")).as("year")
                        .and(DateOperators.DayOfMonth.dayOfMonth("Connexion_date")).as("day"),
                Aggregation.match(new Criteria("day").is(day)),
                Aggregation.match(new Criteria("month").is(month)),
                Aggregation.match(new Criteria("year").is(year)),

                Aggregation.group("id_client").count().as("distinctUserCount"),
                Aggregation.project("id_client").and("distinctUserCount").as("jours")
                        .and(ConvertOperators.ToObjectId.toObjectId("$_id")).as("userId"),
                Aggregation.lookup("Users","userId","_id","users"),
                Aggregation.project("users.name","users.username","jours")
        );
        System.out.println("test");
        System.out.println(agg);
        List<UserConnexionCount> results = mongoOperations.aggregate(agg , "Connexions", UserConnexionCount.class).getMappedResults();
        return results;

    }




}


