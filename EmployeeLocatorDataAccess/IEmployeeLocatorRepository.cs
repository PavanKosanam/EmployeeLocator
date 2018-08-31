using System.Collections.Generic;

namespace EmployeeLocatorDataAccess
{
    public interface IEmployeeLocatorRepository
    {
        List<GetEmpDetails_Result> FindPersonOrLocationById(int Id);
        List<FindPersonOrLoc_Result> FindPersonOrLocation(string searchTerm);
        List<GetAvailablePlaces_Result> GetAvailablePlaces();
        List<PathModel> GetPaths();
        void Save();
    }
}
