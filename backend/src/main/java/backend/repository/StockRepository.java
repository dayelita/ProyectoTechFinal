package backend.repository;
import backend.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface StockRepository extends JpaRepository<Stock, Long> {

}