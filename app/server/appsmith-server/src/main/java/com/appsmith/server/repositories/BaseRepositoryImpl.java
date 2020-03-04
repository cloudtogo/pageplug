package com.appsmith.server.repositories;

import com.appsmith.external.models.BaseDomain;
import com.appsmith.server.constants.FieldName;
import com.appsmith.server.domains.User;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.ReactiveMongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.repository.query.MongoEntityInformation;
import org.springframework.data.mongodb.repository.support.SimpleReactiveMongoRepository;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.util.Assert;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.Serializable;
import java.util.List;

import static com.appsmith.server.repositories.BaseAppsmithRepositoryImpl.notDeleted;
import static com.appsmith.server.repositories.BaseAppsmithRepositoryImpl.userAcl;
import static org.springframework.data.mongodb.core.query.Criteria.where;

/**
 * This repository implementation is the base class that will be used by Spring Data running all the default JPA queries.
 * We override the default implementation {@link SimpleReactiveMongoRepository} to filter out records marked with
 * deleted=true.
 * To enable this base implementation, it MUST be set in the annotation @EnableReactiveMongoRepositories.repositoryBaseClass.
 * This is currently defined in {@link com.appsmith.server.configurations.MongoConfig} (liable to change in the future).
 * <p>
 * An implementation like this can also be used to set default query parameters based on the user's role and permissions
 * to filter out data that they are allowed to see. This is will be implemented with ACL.
 *
 * @param <T>  The domain class that extends {@link BaseDomain}. This is required because we use default fields in
 *             {@link BaseDomain} such as `deleted`
 * @param <ID> The ID field that extends Serializable interface
 */
@Slf4j
public class BaseRepositoryImpl<T extends BaseDomain, ID extends Serializable> extends SimpleReactiveMongoRepository<T, ID>
        implements BaseRepository<T, ID> {

    protected final MongoEntityInformation<T, ID> entityInformation;
    protected final ReactiveMongoOperations mongoOperations;

    public BaseRepositoryImpl(@NonNull MongoEntityInformation<T, ID> entityInformation,
                              @NonNull ReactiveMongoOperations mongoOperations) {
        super(entityInformation, mongoOperations);
        this.entityInformation = entityInformation;
        this.mongoOperations = mongoOperations;
    }

    protected Criteria getIdCriteria(Object id) {
        return where(entityInformation.getIdAttribute()).is(id);
    }

    @Override
    public Mono<T> findById(ID id) {
        Assert.notNull(id, "The given id must not be null!");
        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .map(auth -> auth.getPrincipal())
                .flatMap(principal -> {
                    Query query = new Query(getIdCriteria(id));
                    query.addCriteria(new Criteria().andOperator(notDeleted(), userAcl((User) principal, "read")));

                    return mongoOperations.query(entityInformation.getJavaType())
                            .inCollection(entityInformation.getCollectionName())
                            .matching(query)
                            .one();
                });
    }

    @Override
    public Flux<T> findAll() {
        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .map(auth -> auth.getPrincipal())
                .flatMapMany(principal -> {
                    Query query = new Query(notDeleted());
                    query.addCriteria(new Criteria().andOperator(userAcl((User) principal, "read")));
                    return mongoOperations.find(query, entityInformation.getJavaType(), entityInformation.getCollectionName());
                });
    }

    @Override
    public Flux<T> findAll(Example example, Sort sort) {
        Assert.notNull(example, "Sample must not be null!");
        Assert.notNull(sort, "Sort must not be null!");

        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .map(auth -> auth.getPrincipal())
                .flatMapMany(principal -> {

                    Query exampleQuery = new Query(new Criteria().alike(example)) //
                            .collation(entityInformation.getCollation()) //
                            .with(sort);

                    Query query = new Query(notDeleted())
                            .collation(entityInformation.getCollation()) //
                            .with(sort);
                    query.addCriteria(new Criteria().andOperator(userAcl((User) principal, "read"),
                            new Criteria().alike(example)));

                    return mongoOperations.find(query, example.getProbeType(), entityInformation.getCollectionName());
                });
    }

    @Override
    public Flux<T> findAll(Example example) {

        Assert.notNull(example, "Example must not be null!");
        return findAll(example, Sort.unsorted());
    }

    @Override
    public Mono<T> archive(T entity) {
        Assert.notNull(entity, "The given entity must not be null!");
        Assert.notNull(entity.getId(), "The given entity's id must not be null!");
        Assert.isTrue(!entity.getDeleted(), "The given entity is already deleted");

        entity.setDeleted(true);
        return mongoOperations.save(entity, entityInformation.getCollectionName());
    }

    @Override
    public Mono<Boolean> archiveById(ID id) {
        Assert.notNull(id, "The given id must not be null!");

        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .map(auth -> auth.getPrincipal())
                .flatMap(principal -> {
                    Query query = new Query(getIdCriteria(id));
                    query.addCriteria(new Criteria().andOperator(notDeleted(), userAcl((User) principal, "delete")));

                    Update update = new Update();
                    update.set(FieldName.DELETED, true);
                    return mongoOperations.updateFirst(query, update, entityInformation.getJavaType())
                            .map(result -> result.getModifiedCount() > 0 ? true : false);
                });
    }

    @Override
    public Mono<Boolean> archiveAllById(List<ID> ids) {
        Assert.notNull(ids, "The given ids must not be null!");
        Assert.notEmpty(ids, "The given list of ids must not be empty!");

        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .map(auth -> auth.getPrincipal())
                .flatMap(principal -> {
                    Query query = new Query();
                    query.addCriteria(new Criteria().where(FieldName.ID).in(ids));
                    query.addCriteria(new Criteria().andOperator(notDeleted(), userAcl((User) principal, "delete")));

                    Update update = new Update();
                    update.set(FieldName.DELETED, true);
                    return mongoOperations.updateMulti(query, update, entityInformation.getJavaType())
                            .map(result -> result.getModifiedCount() > 0 ? true : false);
                });
    }
}
