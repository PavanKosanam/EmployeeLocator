using System.Collections.Generic;

namespace EmployeeLocatorDataAccess
{
    public interface IEmployeeLocatorRepository
    {
        List<FindPersonOrLoc_Result> FindPersonOrLocation(string searchTerm);
        List<GetAvailablePlaces_Result> GetAvailablePlaces();
        List<PathModel> GetPaths();
        void Save();
    }
}
