using System.Collections.Generic;
using System.Linq;

namespace EmployeeLocatorDataAccess
{
    public class EmployeeLocatorRepository : BaseRepository, IEmployeeLocatorRepository
    {
        public EmployeeLocatorRepository(FloorWalkerEntities context)
            : base(context)
        {
        }

        public List<FindPersonOrLoc_Result> FindPersonOrLocation(string searchTerm)
        {
            var data = _context.FindPersonOrLoc(searchTerm).ToList();
            return data;
        }

        public List<GetAvailablePlaces_Result> GetAvailablePlaces()
        {
            var availablePlaces = _context.GetAvailablePlaces().ToList();
            return availablePlaces;
        }

        public List<PathModel> GetPaths()
        {
            List<Path> paths = new List<Path>();
            paths = _context.Paths.ToList();
            var requiredPaths = paths.Select(x => new PathModel
            {
                From = new MapPoint
                {
                    Width = x.From_X_Value,
                    Height = x.From_Y_Value

                },
                To = new MapPoint
                {
                    Width = x.To_X_Value,
                    Height = x.To_Y_Value

                }
            }).ToList();

            return requiredPaths;
        }
    }
}
